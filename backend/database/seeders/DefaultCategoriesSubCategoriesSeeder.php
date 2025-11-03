<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class DefaultCategoriesSubCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            'Uncategorized' => [
                'Uncategorized'
            ],
            'Electronics' => [
                'Smartphones', 'Laptops', 'Cameras', 'Headphones', 'Televisions'
            ],
            'Fashion' => [
                'Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Watches', 'Bags'
            ],
            'Home & Garden' => [
                'Furniture', 'Kitchenware', 'Lighting', 'Gardening Tools', 'Decor'
            ],
            'Health & Beauty' => [
                'Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Vitamins'
            ],
            'Books' => [
                'Fiction', 'Non-Fiction', 'Science Fiction', 'Biographies', 'Children\'s Books'
            ],
        ];

        foreach ($categories as $categoryName => $subcategories) {
            // Create the parent category
            $category = Category::create(['name' => $categoryName]);

            // Create and associate the subcategories
            foreach ($subcategories as $subcategoryName) {
                $category->subcategories()->create(['name' => $subcategoryName]);
            }
        }
    }
}
