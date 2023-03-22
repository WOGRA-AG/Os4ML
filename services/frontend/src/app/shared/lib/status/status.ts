import { PipelineStatus } from 'src/app/core/models/pipeline-status';

export const getShortStatus = (
  status: string | undefined | null
): PipelineStatus => {
  if (!status) {
    return PipelineStatus.running;
  }
  if (status.startsWith('message.pipeline.done')) {
    return PipelineStatus.done;
  }
  if (status.startsWith('message.pipeline.error')) {
    return PipelineStatus.error;
  }
  return PipelineStatus.running;
};

export const getCssClassForStatus = (
  status: string | undefined | null
): string => {
  if (!status) {
    return 'running';
  }
  switch (getShortStatus(status)) {
    case PipelineStatus.running:
      return 'running';
    case PipelineStatus.done:
      return 'done';
    case PipelineStatus.error:
      return 'error';
  }
};
