const SingleInputField = ({
  label,
  value,
  type,
  onChange,
}: {
  label: string;
  value: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label}
      <input
        type={type}
        className="p-5 border border-text2 rounded-xl"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export default SingleInputField;
