import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ProgressIndicator from '@/components/atoms/ProgressIndicator';

const TaskStatsCard = ({ stats }) => {
  return (
    <Card>
      <Text type="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Progress</Text>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Text type="span" className="text-surface-600 dark:text-surface-400">Completed</Text>
          <Text type="span" className="font-semibold text-surface-900 dark:text-white">{stats.completed}/{stats.total}</Text>
        </div>
        <ProgressIndicator percentage={stats.percentage} />
        <div className="text-center">
          <Text type="span" className="text-2xl font-bold text-primary">{stats.percentage}%</Text>
        </div>
      </div>
    </Card>
  );
};

export default TaskStatsCard;