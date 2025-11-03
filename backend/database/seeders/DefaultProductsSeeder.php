<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DefaultProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Find specific subcategories to add products to
        $laptopsSubcategory = Subcategory::where('name', 'Laptops')->first();
        $smartphonesSubcategory = Subcategory::where('name', 'Smartphones')->first();

        $products = [];

        // Add Laptop products if the subcategory exists
        if ($laptopsSubcategory) {
            $products[] = [
                'name' => 'ProBook X1',
                'description' => 'A high-performance laptop for professionals.',
                'price' => 1299.99,
                'specifications' => '16GB RAM, 512GB SSD, 14-inch Display',
                'stock' => 50,
                'subcategory_id' => $laptopsSubcategory->id,
            ];
            $products[] = [
                'name' => 'Gamer-Z Pro',
                'description' => 'The ultimate gaming laptop with a powerful GPU.',
                'price' => 1999.99,
                'specifications' => '32GB RAM, 1TB SSD, RTX 4080, 17-inch 240Hz Display',
                'stock' => 25,
                'subcategory_id' => $laptopsSubcategory->id,
            ];
        }

        // Add Smartphone products if the subcategory exists
        if ($smartphonesSubcategory) {
            $products[] = [
                'name' => 'Galaxy S25',
                'description' => 'The latest smartphone with an amazing camera.',
                'price' => 999.00,
                'specifications' => '12GB RAM, 256GB Storage, 108MP Camera',
                'stock' => 150,
                'subcategory_id' => $smartphonesSubcategory->id,
            ];
        }


        // Create the products
        foreach ($products as $productData) {
            Product::create([
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'specifications' => $productData['specifications'],
                'stock' => $productData['stock'],
                'subcategory_id' => $productData['subcategory_id'],
                'sku' => 'SKU-' . Str::upper(Str::random(8)), // Generate a random SKU
            ]);
        }
    }
}
