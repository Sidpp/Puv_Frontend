import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'in progress': return 'bg-blue-100 text-blue-800';
        case 'done': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const TaskTable = ({ tasks }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg text-gray-700">Task Details</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Last Interaction</TableHead>
            <TableHead>AI Summary</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-mono">{task.id}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(task.status)}`}>{task.status}</span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(task.priority)}`}>{task.priority}</span>
              </TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>{task.lastInteraction}</TableCell>
              <TableCell>{task.lastInteraction}</TableCell>
              <TableCell><a href="/dashboard/insights/jira-details/686e03fe27c0ee6ccab9377a" className="text-indigo-600 hover:underline text-sm font-semibold">Detail View</a></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
