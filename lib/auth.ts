import { supabase } from '@/lib/supabase'

export async function changePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }

  await supabase.auth.signOut()

  return data
}