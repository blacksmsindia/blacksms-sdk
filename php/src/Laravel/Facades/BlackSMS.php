<?php

namespace BlackSMS\Laravel\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array sendSms(array $params)
 * @method static array sendWhatsApp(array $params)
 * @method static array sendQuickSms(array $params)
 * @method static array createBulkSmsCampaign(array $params)
 * 
 * @see \BlackSMS\BlackSMS
 */
class BlackSMS extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'blacksms';
    }
}
