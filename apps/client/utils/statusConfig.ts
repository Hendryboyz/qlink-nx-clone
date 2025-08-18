// Shared status configuration for vehicle status display
export const STATUS_CONFIG = {
  0: { 
    text: 'VERIFIED', 
    bgColor: '#2DC100',
    textColor: 'white'
  },
  1: { 
    text: 'PENDING', 
    bgColor: '#EFB700',
    textColor: 'white'
  },
  2: { 
    text: 'FAILED', 
    bgColor: '#FF0004',
    textColor: 'white'
  }
} as const;

export type StatusType = keyof typeof STATUS_CONFIG;

// Helper function to get status config
export const getStatusConfig = (status: number | undefined) => {
  const defaultStatus = 0 as StatusType;
  const statusKey = (status !== undefined ? status : defaultStatus) as StatusType;
  return STATUS_CONFIG[statusKey];
};