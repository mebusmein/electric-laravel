<?php

namespace Database\Seeders;

use App\Models\Label;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user 1
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create labels for user 1
        $workLabel = $user1->labels()->create(['name' => 'Work', 'color' => '#6366f1']);
        $personalLabel = $user1->labels()->create(['name' => 'Personal', 'color' => '#10b981']);
        $urgentLabel = $user1->labels()->create(['name' => 'Urgent', 'color' => '#ef4444']);
        $ideasLabel = $user1->labels()->create(['name' => 'Ideas', 'color' => '#f59e0b']);

        // Create todos for user 1
        $todo1 = $user1->todos()->create([
            'title' => 'Complete project documentation',
            'description' => 'Write comprehensive documentation for the new API endpoints',
            'completed' => false,
        ]);
        $todo1->labels()->attach([$workLabel->id, $urgentLabel->id]);

        $todo2 = $user1->todos()->create([
            'title' => 'Review pull requests',
            'description' => 'Check and approve pending PRs from the team',
            'completed' => true,
        ]);
        $todo2->labels()->attach([$workLabel->id]);

        $todo3 = $user1->todos()->create([
            'title' => 'Set up CI/CD pipeline',
            'description' => 'Configure GitHub Actions for automated testing and deployment',
            'completed' => false,
        ]);
        $todo3->labels()->attach([$workLabel->id, $ideasLabel->id]);

        $todo4 = $user1->todos()->create([
            'title' => 'Team meeting preparation',
            'description' => 'Prepare slides for the weekly standup',
            'completed' => true,
        ]);
        $todo4->labels()->attach([$workLabel->id, $personalLabel->id]);

        // Create test user 2
        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create labels for user 2
        $designLabel = $user2->labels()->create(['name' => 'Design', 'color' => '#ec4899']);
        $devLabel = $user2->labels()->create(['name' => 'Development', 'color' => '#8b5cf6']);
        $bugLabel = $user2->labels()->create(['name' => 'Bug', 'color' => '#ef4444']);
        $featureLabel = $user2->labels()->create(['name' => 'Feature', 'color' => '#14b8a6']);

        // Create todos for user 2
        $todo5 = $user2->todos()->create([
            'title' => 'Design new landing page',
            'description' => 'Create mockups for the marketing website redesign',
            'completed' => false,
        ]);
        $todo5->labels()->attach([$designLabel->id, $featureLabel->id]);

        $todo6 = $user2->todos()->create([
            'title' => 'Update user profile component',
            'description' => 'Add avatar upload functionality',
            'completed' => false,
        ]);
        $todo6->labels()->attach([$devLabel->id, $featureLabel->id]);

        $todo7 = $user2->todos()->create([
            'title' => 'Fix mobile navigation bug',
            'description' => 'Menu not closing properly on iOS devices',
            'completed' => true,
        ]);
        $todo7->labels()->attach([$devLabel->id, $bugLabel->id]);
    }
}
