import Label from '@/components/atoms/Label';

const FormField = ({ label, children, required = false, className = '' }) => {
  return (
    <div className={className}>
      <Label>
        {label} {required && '*'}
      </Label>
      {children}
    </div>
  );
};

export default FormField;