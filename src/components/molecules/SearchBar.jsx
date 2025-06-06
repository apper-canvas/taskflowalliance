import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <Input
      type="text"
      placeholder="Search tasks..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      icon={ApperIcon}
      iconName="Search"
    />
  );
};

export default SearchBar;