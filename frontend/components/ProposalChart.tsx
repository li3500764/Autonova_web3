import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Approved', value: 65 },
  { name: 'Remaining', value: 35 }
]

export default function ProposalChart() {
  return (
    <div className="h-32 w-32">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={40}
            outerRadius={55}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill="#8B5CF6" />
            <Cell fill="#3B82F6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}