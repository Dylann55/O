import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function FormAlert(props: {
  hidden: boolean;
  title: string;
  message: string;
}) {
  return (
    <div className="my-4 rounded-md bg-yellow-50 p-4" hidden={props.hidden}>
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{props.title}</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{props.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
