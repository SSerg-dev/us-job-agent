import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `<header class="bg-white border-b border-slate-200">
      <nav class="max-w-5xl mx-auto p-6 flex justify-between items-center">
        <a routerLink="/vacancies" class="text-xl font-bold">US Job Agent</a
        ><span class="text-sm text-slate-500">Local · Manual intake · No applications sent</span>
      </nav>
    </header>
    <main class="max-w-5xl mx-auto p-6"><router-outlet /></main>`,
})
export class App {}
