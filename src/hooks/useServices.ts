import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockElectronAPI } from './useMockElectron';
import type { Service, ServiceItem } from '../types';

const getElectron = () => {
  if (typeof window !== 'undefined' && window.electron) {
    return window.electron;
  }
  return mockElectronAPI;
};

/**
 * Hook to fetch all services
 */
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const electron = getElectron();
      return electron.database.getServices();
    },
  });
}

/**
 * Hook to create a service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; date: string | null; items: ServiceItem[] }) => {
      console.log('🔵 useCreateService mutation called with:', data);
      const electron = getElectron();
      console.log('📡 Calling electron.database.createService...');
      const result = await electron.database.createService(data);
      console.log('✅ Database createService returned:', result);
      return result;
    },
    onSuccess: async (data) => {
      console.log('🎉 Service creation successful, invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['services'] });
      console.log('✅ Queries invalidated');
      
      // Force immediate refetch
      await queryClient.refetchQueries({ queryKey: ['services'] });
      console.log('🔄 Queries refetched');
      
      // Log current service count
      const currentServices = queryClient.getQueryData(['services']);
      console.log('📊 Current services in cache:', currentServices);
    },
    onError: (error) => {
      console.error('❌ Service creation failed:', error);
    }
  });
}

/**
 * Hook to update a service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      const electron = getElectron();
      return electron.database.updateService(service.id, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const electron = getElectron();
      return electron.database.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * Hook to duplicate a service
 */
export function useDuplicateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const electron = getElectron();
      const services = await electron.database.getServices();
      const service = services.find((s: Service) => s.id === id);
      
      if (!service) {
        throw new Error('Service not found');
      }

      const duplicate: Service = {
        ...service,
        id: `service_${Date.now()}`,
        name: `${service.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return electron.database.createService(duplicate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
