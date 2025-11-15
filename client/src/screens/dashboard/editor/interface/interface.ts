 export interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: "editor" | "viewer") => void;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "host" | "editor" | "viewer";
  avatar: string;
  online: boolean;
}

 export interface SessionMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  sessionId: string;
  sessionDate: string;
  onRoleChange: (memberId: string, newRole: "editor" | "viewer") => void;
  onRemoveMember: (memberId: string) => void;
  onCopyLink: () => void;
}
