const Text = ({ type, children, className = '', ...props }) => {
  const getTag = () => {
    switch (type) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'p': return 'p';
      case 'span': return 'span';
      default: return 'p';
    }
  };

  const Tag = getTag();

  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export default Text;