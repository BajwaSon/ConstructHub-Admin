import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a routerLink="/" class="home-link">Return to Home</a>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        padding: 20px;
      }

      h1 {
        font-size: 6rem;
        margin: 0;
        color: #e74c3c;
      }

      h2 {
        font-size: 2rem;
        margin: 1rem 0;
        color: #2c3e50;
      }

      p {
        font-size: 1.2rem;
        color: #7f8c8d;
        margin-bottom: 2rem;
      }

      .home-link {
        padding: 12px 24px;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      .home-link:hover {
        background-color: #2980b9;
      }
    `,
  ],
})
export class NotFoundComponent {}
