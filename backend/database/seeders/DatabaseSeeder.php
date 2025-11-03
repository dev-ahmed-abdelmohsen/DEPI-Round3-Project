<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            RolesAndPermissionsSeeder::class,
            DefaultCategoriesSubCategoriesSeeder::class,
//            DefaultProductsSeeder::class,
            RealisticProductsSeeder::class,
        ]);

         $client = \Laravel\Passport\Client::factory()->create([
             'name' => 'Laravel Personal Access Client',
             'redirect' => 'http://localhost',
             'personal_access_client' => true,
             'password_client' => false,
             'revoked' => false,
         ]);

         \Laravel\Passport\PersonalAccessClient::create([
             'client_id' => $client->id,
         ]);
    }
}
