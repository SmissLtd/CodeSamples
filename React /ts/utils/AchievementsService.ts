import http from './index';
import { Achievement } from '../../shared/types';

class AchievementsService {
  static async fetchAchievements(): Promise<Achievement[]> {
    return await http.get('/achievements');
  }

  static async createAchievement(achievement: object): Promise<Achievement> {
    return await http.post('/achievements', achievement);
  }

  static async updateAchievement(
    id: number,
    achievement: object,
  ): Promise<Achievement> {
    return await http.put(`/achievements/${id}`, achievement);
  }

  static async uploadImage(id: number, file: FormData): Promise<void> {
    return await http.post(`/achievements/${id}/upload-image`, file);
  }

  static async deleteAchievement(id: number): Promise<Achievement> {
    return await http.delete(`/achievements/${id}`);
  }
}

export default AchievementsService;
