import { PipelineStatus } from 'src/app/core/models/pipeline-status';
import { ShortStatusPipe } from '../../pipes/short-status.pipe';

export const getCssClassForStatus = (
  status: string | undefined | null
): string => {
  if (!status) {
    return 'running';
  }
  const pipe = new ShortStatusPipe();
  switch (pipe.transform(status)) {
    case PipelineStatus.running:
      return 'running';
    case PipelineStatus.done:
      return 'done';
    case PipelineStatus.error:
      return 'error';
  }
};
