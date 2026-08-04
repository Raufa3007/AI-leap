"use client"

interface Task {
  id: string
  title: string
  subtitle: string
  assignee: string
  time: string
  status: "Open" | "In Progress" | "Done"
}

interface TaskListProps {
  tasks?: Task[]
  onTaskOpen?: (taskId: string) => void
}

const defaultTasks: Task[] = [
  {
    id: "t1",
    title: "Approve & publish RFP - 10000000107",
    subtitle: "IT Department - Service",
    assignee: "Mohamad Aslam",
    time: "Tuesday, 1:20 pm",
    status: "In Progress",
  },
  {
    id: "t2",
    title: "Verify & approve new supplier",
    subtitle: "Supplier verification",
    assignee: "Mohamad Aslam",
    time: "Tuesday, 1:20 pm",
    status: "Open",
  },
  {
    id: "t3",
    title: "Review justification & approve amendment of PO#2342",
    subtitle: "IT Department - Service",
    assignee: "Mohamad Aslam",
    time: "Tuesday, 1:20 pm",
    status: "Open",
  },
  {
    id: "t4",
    title: "Validate budget impact of amendment of PO#2342",
    subtitle: "IT Department - Service",
    assignee: "Mohamad Aslam",
    time: "Tuesday, 1:20 pm",
    status: "Open",
  },
]

export default function TaskList({ tasks = defaultTasks, onTaskOpen }: TaskListProps) {
  const getStatusDot = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-orange-500"
      case "Done":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow flex gap-3"
        >
          <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getStatusDot(task.status)} mt-1`} />

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h4>
            <p className="text-xs text-gray-600 mb-2">{task.subtitle}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{task.assignee}</span>
                <span>•</span>
                <span>{task.time}</span>
              </div>
              <button
                onClick={() => onTaskOpen?.(task.id)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
              >
                {task.status === "In Progress" ? "In Progress" : "Open"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
