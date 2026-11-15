import { supabaseAdmin } from '../supabase'
import NewBookingForm from '../NewBookingForm'

export default async function NewBookingPage() {
  // Fetch active spots for the dropdown
  const { data: spots } = await supabaseAdmin
    .from('spots')
    .select('*')
    .eq('kind', 'rv')
    .eq('status', 'active')
    .order('code', { ascending: true })

  return (
    <div className="py-8">
      <NewBookingForm allSpots={spots || []} />
    </div>
  )
}