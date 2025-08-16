import Title from '../../components/Title';
import StepIndicator from '../sign-up/StepIndicator';

type Props = {
  title: string;
  bottomEle?: React.ReactNode;
  children?: React.ReactNode;
};

const Container = ({ title, bottomEle, children }: Props) => {
  return (
  <div className="w-full py-10 px-12 flex flex-col h-full flex-1">
      <Title className="text-left w-33 pr-16 text-[#FFF0D3]">{title}</Title>
      <div className="pt-14 opacity-0">
        <StepIndicator steps={[1,2,3]} currentStep={1}/>
      </div>
        <div className="mt-14">
        {children}
      </div>
      {bottomEle ? <div className="mt-auto">{bottomEle}</div> : null}
    </div>
  );
};

export default Container;
