import { supabaseAdmin } from './supabase'
import QuickCheckForm from './QuickCheckForm'

export default async function QuickCheckPage() {
  const { data: spots, error } = await supabaseAdmin
    .from('spots')
    .select('*')
    .eq('kind', 'rv')

  if (error) {
    return <div className="text-red-600 p-8">Error loading spots: {error.message}</div>
  }

  // This custom sort fixes the 1, 10, 2 issue
  const sortedSpots = (spots || []).sort((a, b) => {
    const numA = parseInt(a.code.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.code.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <QuickCheckForm allSpots={sortedSpots} />
    </div>
  )
}