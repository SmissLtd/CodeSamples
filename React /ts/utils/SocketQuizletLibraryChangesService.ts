import { SocketIOService } from '.';
import { ROUTINE_ACTIONS, ROUTINE_NOTIFICATIONS } from '../../const/socket';
import { ActiveRoutine, Routine } from '../../shared/types';

class SocketQuizletLibraryChangesService {
  static init(activeRoutineListener: (clientId: string, routine: ActiveRoutine) => void): void {
    SocketIOService.socket?.on(ROUTINE_ACTIONS.ACTIVE_ROUTINE_CHANGED, (data: { activeRoutine: ActiveRoutine }) => {
      activeRoutineListener(data.activeRoutine.clientId, data.activeRoutine);
    });
    SocketIOService.socket?.on(
      ROUTINE_NOTIFICATIONS.PARENT_HISTORY_CHANGED,
      (data: { routine: Routine; action: string; clientId: string }) => {
        console.log(data);
      },
    );
    SocketIOService.socket?.on(
      ROUTINE_NOTIFICATIONS.PARENT_LIBRARY_CHANGED,
      (data: { routine: Routine; action: string; clientId: string }) => {
        console.log(data);
      },
    );
    SocketIOService.socket?.on(
      ROUTINE_NOTIFICATIONS.CHILD_LIBRARY_CHANGED,
      (data: { routine: Routine; action: string; clientId: string }) => {
        console.log(data);
      },
    );
  }
}

export default SocketQuizletLibraryChangesService;
