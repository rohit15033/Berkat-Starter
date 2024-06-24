<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IdGenerationService
{
    public static function generateProductId($type, $attributes): string
    {
        $prefix = static::getTypePrefix($type);
        $baseCode = static::getBaseCode($attributes);

        return DB::transaction(function () use ($prefix, $baseCode) {
            $latestProduct = DB::table('products')
                ->where('id', 'like', $prefix . '-' . $baseCode . '-%')
                ->orderBy('id', 'desc')
                ->lockForUpdate()
                ->first();

            Log::info('Latest product for ID generation:', ['latestProduct' => $latestProduct]);

            if ($latestProduct) {
                $idParts = explode('-', $latestProduct->id);
                $lastNumber = isset($idParts[3]) ? (int)$idParts[3] : 0;
                $nextNumber = str_pad($lastNumber + 1, 2, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = '01';
            }

            return $prefix . '-' . $baseCode . '-' . $nextNumber;
        });
    }

    private static function getTypePrefix($type)
    {
        switch ($type) {
            case 'kebaya':
                return 'K';
            case 'gaun':
                return 'G';
            case 'beskap':
                return 'B';
            default:
                return 'UNK';
        }
    }

    private static function getBaseCode($attributes)
    {
        $colourCode = isset($attributes['colour']) ? static::mapColourCode($attributes['colour']) : 'X';
        $lengthCode = isset($attributes['length']) ? static::mapLengthCode($attributes['length']) : 'X';

        return $colourCode . '-' . $lengthCode;
    }

    private static function mapColourCode($colour)
    {
        switch (strtolower($colour)) {
            case 'putih':
                return 'BW';
            case 'merah':
                return 'M';
            case 'biru':
                return 'B';
            default:
                return substr(strtoupper($colour), 0, 2);
        }
    }

    private static function mapLengthCode($length)
    {
        switch (strtolower($length)) {
            case 'panjang':
                return 'P';
            case 'pendek':
                return 'S';
            default:
                return substr(strtoupper($length), 0, 1);
        }
    }
}
