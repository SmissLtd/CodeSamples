import { TenantUser } from './../../shared/types/Tenant/index';
import http from './index';
import { Tenant } from '../../shared/types';
import FetchTenantUser, { FetchTenant } from '../../shared/types/Tenant';

class TenantService {
  static async fetchTenants(
    page: number,
    range: number,
    orderBy: keyof Tenant,
  ) {
    const data: FetchTenant = await http.get('/tenants', {
      params: { page, range, orderBy },
    });
    return data;
  }

  static async fetchTenantUsers(
    tenantId: number,
    page: number,
    range: number,
    orderBy: string,
  ) {
    const data: FetchTenantUser = await http.get(`/tenants/${tenantId}/users`, {
      params: { page, range, orderBy },
    });
    return data;
  }

  static async deleteTenants(selectedTenants: Array<Tenant>) {
    for (const _tenant of selectedTenants) {
      await http.delete(`tenants/${_tenant.id}`);
    }
  }

  static async approveTenants(selectedTenants: Array<Tenant>) {
    for (const _tenant of selectedTenants) {
      await http.put(`tenants/${_tenant.id}`, {
        isApproved: true,
      });
    }
  }

  static async activateUsers(selectedUsers: Array<TenantUser>) {
    for (const _user of selectedUsers) {
      await http.put(`users/${_user.id}`, {
        isActive: true,
      });
    }
  }

  static async disactivateUsers(selectedUsers: Array<TenantUser>) {
    for (const _user of selectedUsers) {
      await http.put(`users/${_user.id}`, {
        isActive: false,
      });
    }
  }
}

export default TenantService;
