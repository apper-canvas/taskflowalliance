import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';

const TaskFilters = ({ searchQuery, setSearchQuery, selectedStatus, setSelectedStatus }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <Select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        options={statusOptions}
      />
    </div>
  );
};

export default TaskFilters;