<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index()
    {
        return InvoiceResource::collection(Invoice::with('orders.products')->get());
    }

    public function store(StoreInvoiceRequest $request)
    {
        $invoice = DB::transaction(function () use ($request) {
            $invoice = Invoice::create([
                'id' => Str::uuid(),
                'date' => $request->date,
                'due' => $request->due,
                'detail' => $request->detail,
                'marketing' => $request->marketing,
                'status' => $request->status,
                'discount' => $request->discount,
            ]);

            foreach ($request->orders as $orderData) {
                $order = $invoice->orders()->create([
                    'event_date' => $orderData['event_date'],
                    'event_type' => $orderData['event_type'],
                    'price' => $orderData['price'], // Directly set the order price
                    'discount' => $orderData['discount'],
                    'details' => $orderData['details'],
                ]);

                if (isset($orderData['products'])) {
                    foreach ($orderData['products'] as $productData) {
                        $order->products()->attach($productData['product_id'], [
                            'price' => $productData['price'], // Set the product price from request
                            'discount' => $productData['discount'],
                        ]);
                    }

                    // Calculate the order price based on attached products
                    $order->price = $order->calculatePrice();
                    $order->save();
                }
            }

            // Calculate the invoice price based on orders
            $invoice->price = $invoice->orders->sum('price');
            $invoice->save();

            return $invoice;
        });

        return new InvoiceResource($invoice);
    }

    public function show(Invoice $invoice)
    {
        return new InvoiceResource($invoice->load('orders.products'));
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update($request->all());
        return new InvoiceResource($invoice);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully'], 204);
    }
}
