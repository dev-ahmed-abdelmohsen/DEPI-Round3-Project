<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RealisticProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subcategories = Subcategory::all()->keyBy('name');

        $products = [];

        // Electronics
        if (isset($subcategories['Laptops'])) {
            $products[] = [
                'name' => 'ZenBook Pro 15',
                'description' => 'A sleek and powerful laptop for creative professionals.',
                'price' => 1499.99,
                'specifications' => '16GB RAM, 1TB NVMe SSD, 15.6-inch 4K OLED Display, Intel Core i7',
                'stock' => 30,
                'subcategory_id' => $subcategories['Laptops']->id,
            ];
            $products[] = [
                'name' => 'Legion 5 Gaming Laptop',
                'description' => 'Experience top-tier gaming performance with the Legion 5.',
                'price' => 1299.00,
                'specifications' => '16GB DDR4 RAM, 512GB SSD, NVIDIA GeForce RTX 3060, 15.6-inch 165Hz Display',
                'stock' => 40,
                'subcategory_id' => $subcategories['Laptops']->id,
            ];
        }

        if (isset($subcategories['Smartphones'])) {
            $products[] = [
                'name' => 'Pixel 8 Pro',
                'description' => 'The latest Google Pixel with an advanced camera system.',
                'price' => 999.00,
                'specifications' => '12GB RAM, 256GB Storage, 6.7-inch LTPO Display, Google Tensor G3',
                'stock' => 120,
                'subcategory_id' => $subcategories['Smartphones']->id,
            ];
        }

        if (isset($subcategories['Cameras'])) {
            $products[] = [
                'name' => 'Alpha A7 IV Mirrorless Camera',
                'description' => 'A versatile hybrid camera for both stills and video.',
                'price' => 2499.99,
                'specifications' => '33MP Full-Frame Sensor, 4K 60p Video, Real-time Eye AF',
                'stock' => 20,
                'subcategory_id' => $subcategories['Cameras']->id,
            ];
        }

        if (isset($subcategories['Headphones'])) {
            $products[] = [
                'name' => 'WH-1000XM5 Wireless Headphones',
                'description' => 'Industry-leading noise-canceling headphones.',
                'price' => 399.99,
                'specifications' => '30-hour battery life, Multi-point connection, Hi-Res Audio',
                'stock' => 200,
                'subcategory_id' => $subcategories['Headphones']->id,
            ];
        }

        // Fashion
        if (isset($subcategories['Men\'s Clothing'])) {
            $products[] = [
                'name' => 'Classic Denim Jacket',
                'description' => 'A timeless denim jacket for any occasion.',
                'price' => 89.99,
                'specifications' => '100% Cotton, Button Closure, Slim Fit',
                'stock' => 75,
                'subcategory_id' => $subcategories['Men\'s Clothing']->id,
            ];
        }

        if (isset($subcategories['Women\'s Clothing'])) {
            $products[] = [
                'name' => 'Floral Maxi Dress',
                'description' => 'An elegant and comfortable dress for summer.',
                'price' => 120.00,
                'specifications' => 'Lightweight fabric, V-neck, Ankle-length',
                'stock' => 60,
                'subcategory_id' => $subcategories['Women\'s Clothing']->id,
            ];
        }

        // Books
        if (isset($subcategories['Fiction'])) {
            $products[] = [
                'name' => 'The Midnight Library',
                'description' => 'A novel by Matt Haig.',
                'price' => 15.99,
                'specifications' => 'Hardcover, 304 pages',
                'stock' => 150,
                'subcategory_id' => $subcategories['Fiction']->id,
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

