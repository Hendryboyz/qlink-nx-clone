import Title from '../../components/Title';

type Props = {
  title: string;
  bottomEle?: React.ReactNode;
  children?: React.ReactNode;
};

const Container = ({ title, bottomEle, children }: Props) => {
  return (
    <div className="w-full py-16 pb-10 px-12 flex flex-col h-full flex-1 ">
      <Title className="mb-12 text-left w-10 text-[#FFF0D3]">
        {title}
      </Title>
      {children}
      {bottomEle ? <div className="mt-auto">{bottomEle}</div> : null}
    </div>
  );
};

export default Container;
