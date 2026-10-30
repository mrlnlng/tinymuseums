'use client'

import { useSyncExternalStore } from 'react'
import { defaultStore, type MemberInfo } from './store.ts'

export interface UseMember {
  member: MemberInfo | null
  signUp(email: string, password: string): Promise<null | 'invalid' | 'email_taken'>
  signIn(email: string, password: string): Promise<boolean>
  changePassword(current: string, next: string): Promise<boolean>
  signOut(options?: { force?: boolean }): Promise<'ok' | 'dirty'>
  deleteAccount(password: string, options?: { force?: boolean }): Promise<true | false | 'dirty'>
  hasDirty(): boolean
  refreshMember(): Promise<void>
  exportData(): Promise<Blob | null>
}

const noopSubscribe = () => () => {}

export function useMember(): UseMember {
  const store = typeof window === 'undefined' ? null : defaultStore()
  const member = useSyncExternalStore(
    store ? store.subscribeMember : noopSubscribe,
    store ? store.getMemberSnapshot : () => null,
    () => null,
  )
  if (!store) {
    return {
      member: null,
      signUp: async () => 'invalid',
      signIn: async () => false,
      changePassword: async () => false,
      signOut: async () => 'ok',
      deleteAccount: async () => false,
      hasDirty: () => false,
      refreshMember: async () => {},
      exportData: async () => null,
    }
  }
  return {
    member,
    signUp: store.signUp,
    signIn: store.signIn,
    changePassword: store.changePassword,
    signOut: store.signOut,
    deleteAccount: store.deleteAccount,
    hasDirty: store.hasDirty,
    refreshMember: store.refreshMember,
    exportData: store.exportData,
  }
}
