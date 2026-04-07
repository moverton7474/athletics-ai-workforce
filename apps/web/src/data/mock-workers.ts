import type { WorkerDTO } from '../lib/types';

export const mockWorkers: WorkerDTO[] = [
  {
    id: 'worker-chief-of-staff',
    organizationId: 'org-demo',
    name: 'Atlas',
    roleName: 'Chief of Staff',
    mode: 'shared',
    status: 'active',
    tabs: ['chat', 'outputs', 'guidelines', 'settings'],
  },
  {
    id: 'worker-executive-assistant',
    organizationId: 'org-demo',
    name: 'Eva',
    roleName: 'Executive Assistant',
    mode: 'personal',
    status: 'active',
    tabs: ['chat', 'outputs', 'guidelines', 'settings'],
  },
  {
    id: 'worker-sponsorship-intelligence',
    organizationId: 'org-demo',
    name: 'Stan',
    roleName: 'Sponsorship Intelligence',
    mode: 'shared',
    status: 'active',
    tabs: ['chat', 'outputs', 'guidelines', 'settings'],
  },
];
