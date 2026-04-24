import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId ? Number(decoded.userId) : null;
    } catch (error) {
      console.error("Token decoding failed", error);
      return null;
    }
  }
}
