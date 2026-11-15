import { supabaseAdmin } from './supabase'
import QuickCheckForm from './QuickCheckForm'

export default async function QuickCheckPage() {
  // Fetch the physical spots from the database to pass to the form
  const { data: spots, error } = await supabaseAdmin
    .from('spots')
    .select('*')
    .eq('kind', 'rv')
    .order('code', { ascending: true })

  if (error) {
    return <div className="text-red-600 p-8">Error loading spots: {error.message}</div>
  }

  return (
    <div className="max-w-5xl mx-auto">
      <QuickCheckForm allSpots={spots || []} />
    </div>
  )
}