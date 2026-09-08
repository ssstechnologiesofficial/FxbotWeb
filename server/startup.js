import { emailService } from './emailService.js';

export async function validateAndStartApplication({
  loadServer = () => import('./index.js')
} = {}) {
  if (process.env.NODE_ENV === 'production') {
    emailService.validateConfiguration();
  }

  return loadServer();
}