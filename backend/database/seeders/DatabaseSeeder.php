<?php

namespace Database\Seeders;

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

        // Create todos for user 1
        $user1->todos()->createMany([
            [
                'title' => 'Complete project documentation',
                'description' => 'Write comprehensive documentation for the new API endpoints',
                'completed' => false,
            ],
            [
                'title' => 'Review pull requests',
                'description' => 'Check and approve pending PRs from the team',
                'completed' => true,
            ],
            [
                'title' => 'Set up CI/CD pipeline',
                'description' => 'Configure GitHub Actions for automated testing and deployment',
                'completed' => false,
            ],
            [
                'title' => 'Team meeting preparation',
                'description' => 'Prepare slides for the weekly standup',
                'completed' => true,
            ],
        ]);

        // Create test user 2
        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create todos for user 2
        $user2->todos()->createMany([
            [
                'title' => 'Design new landing page',
                'description' => 'Create mockups for the marketing website redesign',
                'completed' => false,
            ],
            [
                'title' => 'Update user profile component',
                'description' => 'Add avatar upload functionality',
                'completed' => false,
            ],
            [
                'title' => 'Fix mobile navigation bug',
                'description' => 'Menu not closing properly on iOS devices',
                'completed' => true,
            ],
        ]);
    }
}
