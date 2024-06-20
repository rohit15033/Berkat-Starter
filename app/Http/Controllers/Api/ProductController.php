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
use App\Services\IdGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            $query->where('product_id', 'LIKE', "%{$search}%");
        }

        $products = $query->with(['kebaya', 'beskap', 'gaun'])
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

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
        $attributes = $request->all();

        // Generate the product ID
        $productId = IdGenerationService::generateProductId($request->type, $attributes);
        Log::info("Generated Product ID: " . $productId);

        // Create the product
        $product = Product::create([
            'id' => $productId,
            'type' => $request->type,
        ]);

        // Ensure the product creation was successful
        if (!$product) {
            return response()->json(['error' => 'Product creation failed'], 500);
        }

        // Create the related model based on the product type
        switch ($product->type) {
            case 'kebaya':
                Kebaya::create([
                    'product_id' => $productId,
                    'colour' => $request->colour,
                    'length' => $request->length
                ]);
                break;
            case 'beskap':
                Beskap::create([
                    'product_id' => $productId,
                    'adat' => $request->adat,
                    'colour' => $request->colour
                ]);
                break;
            case 'gaun':
                Gaun::create([
                    'product_id' => $productId,
                    'colour' => $request->colour,
                    'length' => $request->length
                ]);
                break;
        }

        return response()->json(new ProductResource($product->load(['kebaya', 'beskap', 'gaun'])), 201);
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
    public function update(UpdateProductRequest $request, Product $product)
    {
        $attributes = $request->all();

        switch ($product->type) {
            case 'kebaya':
                $product->kebaya->update([
                    'colour' => $request->colour,
                    'length' => $request->length
                ]);
                break;
            case 'beskap':
                $product->beskap->update([
                    'adat' => $request->adat,
                    'colour' => $request->colour
                ]);
                break;
            case 'gaun':
                $product->gaun->update([
                    'colour' => $request->colour,
                    'length' => $request->length
                ]);
                break;
        }

        return response()->json(new ProductResource($product->load(['kebaya', 'beskap', 'gaun'])));
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

