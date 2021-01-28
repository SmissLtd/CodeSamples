import { SocketIOService } from '.';
import { TeamMember } from '../../shared/types';

const timerStart = 'timerStart';
const timerEnd = 'timerEnd';
const statusChanged = 'statusChanged';

class SocketTimerService {
  static initTimer(
    onTimerStart: (track: string) => void,
    onTimerEnd: (time: string) => void,
    onStatusChanged: (user: TeamMember) => void,
  ): void {
    SocketIOService.socket?.on(timerStart, (tracker: string | null) => {
      onTimerStart(tracker as string);
    });
    SocketIOService.socket?.on(timerEnd, (timer: string | null) => {
      onTimerEnd(timer as string);
    });
    SocketIOService.socket?.on(statusChanged, (user: TeamMember) => {
      onStatusChanged(user);
    });
  }
  static startTask(taskId: number | null): void {
    SocketIOService.socket?.emit(timerStart, { taskId });
  }
  static endTask(): void {
    SocketIOService.socket?.emit(timerEnd);
  }
}

export default SocketTimerService;
