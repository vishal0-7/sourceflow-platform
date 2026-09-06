import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transformation, AudienceProfile, EmailRecipient, ReviewStatus, DeliveryStatus } from '../types/transformation';
import { GroundingClaim, ClaimStatus } from '../types/claim';
import { UserSession, UserRole } from '../types/user';
import { AuditRecord } from '../types/audit';
import { OutputDossier, OutputVariant } from '../types/output';
import { Workspace, WorkspaceType, Dashboard, DashboardType } from '../types/workspace';
import { initialTransformation, initialAudienceProfiles, initialClaims23, initialOutputs, mockDocumentsList } from '../data/demoData';
import { primaryMockOutput } from '../data/mockOutputs';
import { documentService } from '../services/documentService';
import { generationService } from '../services/generationService';
import { verificationService } from '../services/verificationService';
import { deliveryService } from '../services/deliveryService';
import { auditService } from '../services/auditService';
import { authService, defaultUserSession } from '../services/authService';
import { workspaceService } from '../services/workspaceService';

interface AppContextType {
  currentRoute: string;
  navigate: (route: string) => void;
  
  // Authentication State
  isAuthenticated: boolean;
  currentUser: UserSession;
  userSession: UserSession; // Alias for backward compatibility
  login: (email?: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;

  // Workspace & Dashboard State
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentDashboard: Dashboard | null;
  selectWorkspace: (workspaceId: string) => void;
  createWorkspace: (payload: { name: string; description: string; type: WorkspaceType }) => Promise<Workspace>;
  selectDashboard: (dashboardId: string) => void;
  createDashboard: (payload: { name: string; description: string; type: DashboardType; modules: string[] }) => Promise<Dashboard>;
  
  // Central Transformation State (Single Source of Truth)
  transformation: Transformation;
  setTransformation: React.Dispatch<React.SetStateAction<Transformation>>;
  
  // Claim Interaction State
  selectedClaim: GroundingClaim | null;
  setSelectedClaim: (claim: GroundingClaim | null) => void;
  flaggedOnlyFilter: boolean;
  toggleFlaggedFilter: () => void;
  
  // Modals & Drawers
  isSearchPaletteOpen: boolean;
  setIsSearchPaletteOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isAuditDrawerOpen: boolean;
  setIsAuditDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Computed Metrics
  supportedClaimsCount: number;
  unsupportedClaimsCount: number;
  resolvedClaimsCount: number;
  isApprovalBlocked: boolean;
  
  // Core Workflow Actions
  uploadSourceFile: (file: File) => Promise<void>;
  analyzeSource: () => Promise<void>;
  toggleProfile: (profileId: string) => void;
  generateDeliverables: () => Promise<void>;
  updateClaimStatus: (claimId: string, status: ClaimStatus, note?: string) => Promise<void>;
  editClaimPhrasing: (claimId: string, newText: string, note?: string) => Promise<void>;
  deleteClaim: (claimId: string) => Promise<void>;
  approveOutputs: () => Promise<boolean>;
  sendCommunication: (payload?: { subject: string; message: string }) => Promise<boolean>;
  resetTransformationDemo: () => void;

  // Output Studio & Compatibility helpers
  outputDossier: OutputDossier;
  setOutputDossier: (dossier: OutputDossier) => void;
  activeStudioTab: OutputVariant;
  setActiveStudioTab: (tab: OutputVariant) => void;
  approveJobForDispatch: () => Promise<void>;
  claimsList: GroundingClaim[];
  auditLogs: AuditRecord[];
  activeJob: any;
  jobsList: any[];
  setActiveJob: (job: any) => void;
  updateClaimVerification: (claimId: string, status: ClaimStatus, note?: string) => Promise<void>;
  editClaimText: (claimId: string, newText: string, note?: string) => Promise<void>;
  advanceWorkflowStage: (stage: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    return defaultUserSession;
  });

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash;
    if (!authService.isAuthenticated()) return '#/login';
    return hash || '#/overview';
  });

  // Workspace & Dashboard state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);

  // Central Transformation State
  const [transformation, setTransformation] = useState<Transformation>(initialTransformation);
  const [selectedClaim, setSelectedClaim] = useState<GroundingClaim | null>(initialClaims23[4]); // default to Claim #5 (unsupported)
  const [flaggedOnlyFilter, setFlaggedOnlyFilter] = useState<boolean>(false);
  
  // Modals & Drawers
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Output Studio tab
  const [outputDossier, setOutputDossier] = useState<OutputDossier>(primaryMockOutput);
  const [activeStudioTab, setActiveStudioTab] = useState<OutputVariant>('advisory');

  // Initialize workspaces & session
  useEffect(() => {
    const init = async () => {
      // Load session
      const sessionRes = await authService.getSession();
      if (sessionRes.data) {
        setCurrentUser(sessionRes.data);
        setIsAuthenticated(true);
      }

      // Load workspaces
      const wsRes = await workspaceService.getWorkspaces();
      setWorkspaces(wsRes.data);

      const savedWsId = workspaceService.getActiveWorkspaceId() || 'workspace-001';
      const activeWs = wsRes.data.find(w => w.id === savedWsId) || wsRes.data[0] || null;
      setCurrentWorkspace(activeWs);

      if (activeWs && activeWs.dashboards.length > 0) {
        const savedDashId = workspaceService.getActiveDashboardId() || 'dashboard-001';
        const activeDash = activeWs.dashboards.find(d => d.id === savedDashId) || activeWs.dashboards[0];
        setCurrentDashboard(activeDash);
      }
    };

    init();
  }, []);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/overview';
      setCurrentRoute(hash);

      // Handle route parsing: #/workspace/:workspaceId
      if (hash.startsWith('#/workspace/')) {
        const parts = hash.replace('#/workspace/', '').split('/');
        const wsId = parts[0];
        if (wsId) {
          const matchedWs = workspaces.find(w => w.id === wsId);
          if (matchedWs && matchedWs.id !== currentWorkspace?.id) {
            setCurrentWorkspace(matchedWs);
            workspaceService.setActiveWorkspaceId(matchedWs.id);
          }
        }
        if (parts[1] === 'dashboard' && parts[2]) {
          const dashId = parts[2];
          const matchedDash = currentWorkspace?.dashboards.find(d => d.id === dashId);
          if (matchedDash && matchedDash.id !== currentDashboard?.id) {
            setCurrentDashboard(matchedDash);
            workspaceService.setActiveDashboardId(matchedDash.id);
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [workspaces, currentWorkspace, currentDashboard]);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Authentication Handlers
  const login = async (email = 'operator@sourceflow.demo', password = '', rememberMe = true) => {
    const res = await authService.login(email, password, rememberMe);
    if (res.data) {
      setCurrentUser(res.data);
      setIsAuthenticated(true);
      
      // Select default workspace and dashboard if not already selected
      if (!currentWorkspace && workspaces.length > 0) {
        setCurrentWorkspace(workspaces[0]);
        workspaceService.setActiveWorkspaceId(workspaces[0].id);
        if (workspaces[0].dashboards.length > 0) {
          setCurrentDashboard(workspaces[0].dashboards[0]);
          workspaceService.setActiveDashboardId(workspaces[0].dashboards[0].id);
        }
      }
      showToast(`Welcome back, ${res.data.name}`);
      navigate('#/overview');
      return { success: true };
    }
    return { success: false, error: 'Login failed' };
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    showToast('Signed out of SourceFlow');
    navigate('#/login');
  };

  const setUserRole = async (role: UserRole) => {
    const res = await authService.switchRole(role);
    setCurrentUser(res.data);
    showToast(`Role switched to: ${role}`);
  };

  // Workspace & Dashboard Actions
  const selectWorkspace = (workspaceId: string) => {
    const ws = workspaces.find(w => w.id === workspaceId);
    if (ws) {
      setCurrentWorkspace(ws);
      workspaceService.setActiveWorkspaceId(ws.id);
      if (ws.dashboards.length > 0) {
        setCurrentDashboard(ws.dashboards[0]);
        workspaceService.setActiveDashboardId(ws.dashboards[0].id);
      } else {
        setCurrentDashboard(null);
      }
      showToast(`Switched to workspace: ${ws.name}`);
      navigate(`#/workspace/${ws.id}`);
    }
  };

  const createWorkspace = async (payload: { name: string; description: string; type: WorkspaceType }): Promise<Workspace> => {
    const res = await workspaceService.createWorkspace(payload);
    const newWs = res.data;
    setWorkspaces(prev => [...prev, newWs]);
    setCurrentWorkspace(newWs);
    workspaceService.setActiveWorkspaceId(newWs.id);
    if (newWs.dashboards.length > 0) {
      setCurrentDashboard(newWs.dashboards[0]);
      workspaceService.setActiveDashboardId(newWs.dashboards[0].id);
    }
    showToast(`Workspace "${newWs.name}" created ✓`);
    navigate(`#/workspace/${newWs.id}`);
    return newWs;
  };

  const selectDashboard = (dashboardId: string) => {
    if (!currentWorkspace) return;
    const dash = currentWorkspace.dashboards.find(d => d.id === dashboardId);
    if (dash) {
      setCurrentDashboard(dash);
      workspaceService.setActiveDashboardId(dash.id);
      showToast(`Active dashboard: ${dash.name}`);
      navigate('#/overview');
    }
  };

  const createDashboard = async (payload: { name: string; description: string; type: DashboardType; modules: string[] }): Promise<Dashboard> => {
    if (!currentWorkspace) throw new Error('No active workspace');
    const res = await workspaceService.createDashboard(currentWorkspace.id, payload);
    const newDash = res.data;
    
    // Update local workspace state
    const updatedWs = {
      ...currentWorkspace,
      dashboards: [...currentWorkspace.dashboards, newDash]
    };
    setCurrentWorkspace(updatedWs);
    setWorkspaces(prev => prev.map(w => w.id === updatedWs.id ? updatedWs : w));
    setCurrentDashboard(newDash);
    workspaceService.setActiveDashboardId(newDash.id);

    showToast(`Dashboard "${newDash.name}" added ✓`);
    navigate('#/overview');
    return newDash;
  };

  const toggleFlaggedFilter = () => {
    setFlaggedOnlyFilter(prev => !prev);
  };

  // Computed Claims metrics strictly derived from the claims array
  const unsupportedClaims = transformation.claims.filter(
    c => c.status === 'NEEDS_REVIEW' || c.status === 'UNSUPPORTED'
  );
  const unsupportedClaimsCount = unsupportedClaims.length;
  
  const supportedClaims = transformation.claims.filter(
    c => c.status === 'SUPPORTED' || c.status === 'RESOLVED' || c.status === 'EDITED' || c.status === 'HUMAN_APPROVED'
  );
  const supportedClaimsCount = supportedClaims.length;

  const resolvedClaimsCount = transformation.claims.filter(
    c => c.status === 'RESOLVED' || c.status === 'EDITED'
  ).length;

  const isApprovalBlocked = unsupportedClaimsCount > 0;

  // 1. Upload Source File Action
  const uploadSourceFile = async (file: File) => {
    const uploadRes = await documentService.uploadDocument(file);
    const newSource = uploadRes.data;

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'DOCUMENT_UPLOADED',
      details: `Uploaded ${newSource.name} (${newSource.size}) with SHA-256: ${newSource.sha256.slice(0, 16)}...`
    });

    setTransformation(prev => ({
      ...prev,
      title: file.name.replace(/\.[^/.]+$/, ''),
      source: newSource,
      audit: [...prev.audit, auditBlock]
    }));

    showToast('Source uploaded • SHA-256 calculated ✓');
  };

  // 2. Analyze Source Action
  const analyzeSource = async () => {
    const analysisRes = await documentService.analyzeDocument(transformation.source.id);
    
    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: 'System Automated',
      actorRole: 'System Automated',
      action: 'INTELLIGENCE_EXTRACTED',
      details: `Extracted ${analysisRes.data.entities} entities, ${analysisRes.data.evidence} evidence anchors, and ${analysisRes.data.findings} key findings from 20 pages.`
    });

    setTransformation(prev => ({
      ...prev,
      analysis: analysisRes.data,
      audit: [...prev.audit, auditBlock]
    }));

    showToast('Source analysis complete ✓');
  };

  // 3. Toggle Audience Profile
  const toggleProfile = (profileId: string) => {
    setTransformation(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === profileId ? { ...p, isSelected: !p.isSelected } : p
      )
    }));
  };

  // 4. Generate Deliverables Action
  const generateDeliverables = async () => {
    const genRes = await generationService.generateDeliverables(
      transformation.id,
      transformation.profiles
    );

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: 'System Automated',
      actorRole: 'System Automated',
      action: 'TRANSFORMATION_GENERATED',
      details: `Generated ${genRes.data.length} audience deliverables: Executive Brief, Technical Advisory, Communication Package.`
    });

    setTransformation(prev => ({
      ...prev,
      outputs: genRes.data,
      audit: [...prev.audit, auditBlock]
    }));

    showToast('Deliverables generated • Ready for verification');
  };

  // 5. Update Claim Status
  const updateClaimStatus = async (claimId: string, status: ClaimStatus, note?: string) => {
    const res = await verificationService.updateClaimStatus(
      claimId,
      status,
      currentUser.name,
      note
    );
    const updatedClaim = res.data;

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: status === 'SUPPORTED' || status === 'RESOLVED' || status === 'HUMAN_APPROVED' ? 'CLAIM_RESOLVED' : 'CLAIMS_VERIFIED',
      details: `Claim #${updatedClaim.claimIndex} (${updatedClaim.sectionTitle}) verified and marked as [${status}].`
    });

    setTransformation(prev => {
      const updatedClaims = prev.claims.map(c => c.id === claimId ? updatedClaim : c);
      const remainingUnsupported = updatedClaims.filter(
        c => c.status === 'NEEDS_REVIEW' || c.status === 'UNSUPPORTED'
      ).length;

      return {
        ...prev,
        claims: updatedClaims,
        review: {
          ...prev.review,
          status: remainingUnsupported === 0 && prev.review.status !== 'APPROVED' ? 'READY_FOR_APPROVAL' : prev.review.status
        },
        audit: [...prev.audit, auditBlock]
      };
    });

    if (selectedClaim?.id === claimId) {
      setSelectedClaim(updatedClaim);
    }

    showToast(`Claim #${updatedClaim.claimIndex} verified • Audit recorded ✓`);
  };

  // 6. Edit Claim Phrasing
  const editClaimPhrasing = async (claimId: string, newText: string, note?: string) => {
    const res = await verificationService.editClaimPhrasing(
      claimId,
      newText,
      currentUser.name,
      note
    );
    const updatedClaim = res.data;

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CLAIM_EDITED',
      details: `Claim #${updatedClaim.claimIndex} phrasing corrected to align with source passage on Page ${updatedClaim.pageNumber}.`
    });

    setTransformation(prev => {
      const updatedClaims = prev.claims.map(c => c.id === claimId ? updatedClaim : c);
      const remainingUnsupported = updatedClaims.filter(
        c => c.status === 'NEEDS_REVIEW' || c.status === 'UNSUPPORTED'
      ).length;
      
      return {
        ...prev,
        claims: updatedClaims,
        review: {
          ...prev.review,
          status: remainingUnsupported === 0 && prev.review.status !== 'APPROVED' ? 'READY_FOR_APPROVAL' : prev.review.status
        },
        audit: [...prev.audit, auditBlock]
      };
    });

    if (selectedClaim?.id === claimId) {
      setSelectedClaim(updatedClaim);
    }

    showToast(`Claim #${updatedClaim.claimIndex} resolved • Source verified ✓`);
  };

  // 7. Delete Claim
  const deleteClaim = async (claimId: string) => {
    const claim = transformation.claims.find(c => c.id === claimId);
    await verificationService.deleteClaim(claimId);

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CLAIMS_VERIFIED',
      details: `Removed Claim #${claim?.claimIndex || claimId} during human review.`
    });

    setTransformation(prev => {
      const updatedClaims = prev.claims.filter(c => c.id !== claimId);
      const remainingUnsupported = updatedClaims.filter(
        c => c.status === 'NEEDS_REVIEW' || c.status === 'UNSUPPORTED'
      ).length;

      return {
        ...prev,
        claims: updatedClaims,
        review: {
          ...prev.review,
          status: remainingUnsupported === 0 && prev.review.status !== 'APPROVED' ? 'READY_FOR_APPROVAL' : prev.review.status
        },
        audit: [...prev.audit, auditBlock]
      };
    });

    if (selectedClaim?.id === claimId) {
      setSelectedClaim(transformation.claims.find(c => c.id !== claimId) || null);
    }

    showToast(`Claim removed • Audit recorded ✓`);
  };

  // 8. Approve Outputs (Strictly Gated on all claims being resolved)
  const approveOutputs = async (): Promise<boolean> => {
    if (isApprovalBlocked) {
      showToast('Approval blocked: Unresolved unsupported claims remain.');
      return false;
    }

    const approvedAt = new Date().toISOString();
    
    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'REVIEWER_APPROVED',
      details: `Formal human approval granted by Reviewing Officer ${currentUser.name} (${currentUser.role}). All 23 claims attested.`
    });

    setTransformation(prev => ({
      ...prev,
      review: {
        status: 'APPROVED',
        reviewer: currentUser.name,
        approvedAt
      },
      outputs: prev.outputs.map(out => ({ ...out, verificationState: 'APPROVED' })),
      audit: [...prev.audit, auditBlock]
    }));

    showToast('Outputs approved • Ready for delivery ✓');
    return true;
  };

  const approveJobForDispatch = async () => {
    await approveOutputs();
  };

  // 9. Send Communication (Strictly Gated on prior approval)
  const sendCommunication = async (payload?: { subject: string; message: string }): Promise<boolean> => {
    if (transformation.review.status !== 'APPROVED') {
      showToast('Delivery blocked: Outputs must be approved before sending.');
      return false;
    }

    const subject = payload?.subject || transformation.delivery.subject;
    const message = payload?.message || transformation.delivery.message;

    const dispatchRes = await deliveryService.sendCommunication(transformation.id, {
      recipients: transformation.delivery.recipients,
      subject,
      message
    });

    const auditBlock = await auditService.recordAuditEvent({
      jobId: transformation.id,
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'COMMUNICATION_DELIVERED',
      details: `Dispatched verified communication package to ${transformation.delivery.recipients.length} configured stakeholders.`
    });

    setTransformation(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        status: 'SENT',
        sentAt: dispatchRes.data.sentAt,
        subject,
        message
      },
      audit: [...prev.audit, auditBlock]
    }));

    showToast('Communication delivered successfully ✓');
    return true;
  };

  const resetTransformationDemo = () => {
    auditService.resetAuditLogs();
    setTransformation(initialTransformation);
    setSelectedClaim(initialClaims23[4]);
    showToast('Reset to demo transformation state');
  };

  // Dynamic compatibility helpers
  const activeJobCompat = {
    id: transformation.id,
    title: transformation.title,
    sha256: transformation.source.sha256,
    fileType: transformation.source.type,
    fileSize: transformation.source.size,
    status: unsupportedClaimsCount > 0 ? 'NEEDS_REVIEW' : (transformation.review.status === 'APPROVED' ? 'HUMAN_APPROVED' : 'READY_FOR_APPROVAL'),
    workflowStage: transformation.delivery.status === 'SENT' ? 5 : (transformation.review.status === 'APPROVED' ? 5 : 4),
    claimsTotal: transformation.claims.length,
    claimsVerified: supportedClaimsCount,
    claimsFlagged: unsupportedClaimsCount,
    updatedAt: new Date().toISOString()
  };

  const jobsListCompat = mockDocumentsList.map(doc => {
    if (doc.id === transformation.id) {
      return {
        ...doc,
        title: transformation.title,
        status: unsupportedClaimsCount > 0 ? 'NEEDS_REVIEW' : (transformation.review.status === 'APPROVED' ? 'HUMAN_APPROVED' : 'READY_FOR_APPROVAL'),
        claimsTotal: transformation.claims.length,
        claimsVerified: supportedClaimsCount,
        claimsFlagged: unsupportedClaimsCount,
        outputs: transformation.outputs.map(o => o.title),
        updatedAt: new Date().toISOString()
      };
    }
    return {
      ...doc,
      status: doc.status === 'NEEDS_REVIEW' ? 'NEEDS_REVIEW' : 'HUMAN_APPROVED',
      updatedAt: new Date().toISOString()
    };
  });

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        isAuthenticated,
        currentUser,
        userSession: currentUser, // Alias for backward compatibility
        login,
        logout,
        setUserRole,
        workspaces,
        currentWorkspace,
        currentDashboard,
        selectWorkspace,
        createWorkspace,
        selectDashboard,
        createDashboard,
        transformation,
        setTransformation,
        selectedClaim,
        setSelectedClaim,
        flaggedOnlyFilter,
        toggleFlaggedFilter,
        isSearchPaletteOpen,
        setIsSearchPaletteOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isAuditDrawerOpen,
        setIsAuditDrawerOpen,
        toastMessage,
        showToast,
        supportedClaimsCount,
        unsupportedClaimsCount,
        resolvedClaimsCount,
        isApprovalBlocked,
        uploadSourceFile,
        analyzeSource,
        toggleProfile,
        generateDeliverables,
        updateClaimStatus,
        editClaimPhrasing,
        deleteClaim,
        approveOutputs,
        sendCommunication,
        resetTransformationDemo,
        // Output Studio & Compatibility
        outputDossier,
        setOutputDossier,
        activeStudioTab,
        setActiveStudioTab,
        approveJobForDispatch,
        claimsList: transformation.claims,
        auditLogs: transformation.audit,
        activeJob: activeJobCompat,
        jobsList: jobsListCompat,
        setActiveJob: () => {},
        updateClaimVerification: updateClaimStatus,
        editClaimText: editClaimPhrasing,
        advanceWorkflowStage: async () => {}
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
