<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Kebaya;
use App\Models\Beskap;
use App\Models\Gaun;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\ProductImage;
use App\Services\ProductIdGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $type = $request->query('type', '');

        $query = Product::query();

        if ($type) {
            $query->where('type', $type);
        }

        if ($search) {
            $query->where('id', 'LIKE', "%{$search}%");
        }

        // Eager load relationships based on product type
        $query->when($type === 'kebaya', function ($query) {
            $query->with('kebaya');
        })
            ->when($type === 'beskap', function ($query) {
                $query->with('beskap');
            })
            ->when($type === 'gaun', function ($query) {
                $query->with('gaun');
            })
            ->with('productImages'); // Eager load product images

        // Paginate the results
        $products = $query->orderBy('id', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        // Log the request data
        \Log::info('Update Product Request Data:', [
            'request_all' => $request->all(),
            'request_files' => $request->file('images'),
        ]);

        // Validate and get all request attributes
        $attributes = $request->validated();

        // Generate product ID based on type and other attributes
        $productId = ProductIdGenerationService::generateProductId($attributes['type'], $attributes);

        // Begin a transaction to ensure data consistency
        DB::beginTransaction();

        try {
            // Store each image and collect their paths
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('images', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Create the product with basic attributes
            $product = Product::create([
                'id' => $productId,
                'type' => $attributes['type'],
            ]);

            // Handle specific product types
            switch ($attributes['type']) {
                case 'kebaya':
                    Kebaya::create([
                        'product_id' => $productId,
                        'colour' => $attributes['colour'],
                        'length' => $attributes['length']
                    ]);
                    break;
                case 'beskap':
                    Beskap::create([
                        'product_id' => $productId,
                        'adat' => $attributes['adat'],
                        'colour' => $attributes['colour']
                    ]);
                    break;
                case 'gaun':
                    Gaun::create([
                        'product_id' => $productId,
                        'colour' => $attributes['colour'],
                        'length' => $attributes['length']
                    ]);
                    break;
            }

            // Associate product with its images
            foreach ($imagePaths as $path) {
                ProductImage::create([
                    'product_id' => $productId,
                    'path' => $path
                ]);
            }

            // Commit the transaction
            DB::commit();

            // Return success response with the created product
            return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
        } catch (\Exception $e) {
            // Rollback the transaction on exception
            DB::rollBack();

            // Log or handle the exception as needed
            return response()->json(['error' => 'Product creation failed', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return ProductResource
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load(['kebaya', 'beskap', 'gaun']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        // Log the request data
        \Log::info('Update Product Request Data:', [
            'request_all' => $request->all(),
            'request_files' => $request->file('images'),
        ]);

        DB::beginTransaction();

        try {
            // Handle image uploads and deletions
            if ($request->hasFile('images')) {
                // Optionally delete existing images if requested
                if ($request->has('delete_existing_images') && $request->delete_existing_images) {
                    foreach ($product->productImages as $productImage) {
                        // Delete the image file from storage
                        \Storage::disk('public')->delete($productImage->path);
                        // Delete the image record from the database
                        $productImage->delete();
                    }
                }

                // Store new images and create their paths
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('images', 'public');
                    $imagePaths[] = $path;
                }

                // Associate new images with the product
                foreach ($imagePaths as $path) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Product images updated successfully',
                'product' => new ProductResource($product->fresh()->load(['productImages'])),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the exception
            \Log::error('Product update failed:', ['exception' => $e]);

            return response()->json(['error' => 'Product images update failed', 'message' => $e->getMessage()], 500);
        }
    }




    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        switch ($product->type) {
            case 'kebaya':
                $product->kebaya->delete();
                break;
            case 'beskap':
                $product->beskap->delete();
                break;
            case 'gaun':
                $product->gaun->delete();
                break;
        }
        $product->delete();

        return response()->json(null, 204);
    }
}

