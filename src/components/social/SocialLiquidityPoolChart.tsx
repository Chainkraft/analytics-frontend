import { Box, useTheme } from '@mui/material';
import moment from 'moment';
import {
    Area,
    AreaChart,
    Label,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { currencyFormat } from '../../helpers/helpers';
import { ICoinFromPoolDataApi, LiquidityPoolHistory } from '../../interfaces/liquidity-pools.interface';

interface ChartData {
    date: string;
    [symbol: string]: number | string;
}


export function getHourlyData(chartBalances: { coins: ICoinFromPoolDataApi[]; date: Date }[]) {
    const sortedValues = chartBalances
        .filter(value => moment().diff(moment(value.date), 'hours') < 48)
        .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

    // Create a new array to hold the first value for each hour
    const hourlyData = [];

    // Iterate over the sorted and filtered chartValues array and get the first value for each hour
    for (let i = 0; i < sortedValues.length; i++) {
        const value = sortedValues[i];
        const prevValue = sortedValues[i - 1];

        // Check if this is the first value for the hour
        const isFirstHourValue = !prevValue || !moment(value.date).isSame(moment(prevValue.date), 'hour');

        if (isFirstHourValue) {
            hourlyData.push(value);
        }
    }

    return hourlyData;
}

export function processUniswapData(
    { coins, date }: { coins: ICoinFromPoolDataApi[]; date: Date },
    dateFormat: string,
    lp: LiquidityPoolHistory,
): ChartData {
    const [coin0, coin1] = coins;
    const token0Weight = Number(coin0.poolBalance) / lp.tvlUSD;
    const token1Weight = Number(coin1.poolBalance) * Number(coin0.price) / lp.tvlUSD;
    const token0UsdPrice = lp.tvlUSD * token0Weight / Number(coin0.poolBalance);
    const token1UsdPrice = lp.tvlUSD * token1Weight / Number(coin1.poolBalance);

    const dataPoint: ChartData = { date: moment(date).format(dateFormat) };

    dataPoint[coin0.symbol] = token0UsdPrice * Number(coin0.poolBalance);
    dataPoint[coin1.symbol] = token1UsdPrice * Number(coin1.poolBalance);

    return dataPoint;
}

function processData(
    { coins, date }: { coins: ICoinFromPoolDataApi[]; date: Date },
    dateFormat: string
): ChartData {
    const dataPoint: ChartData = {
        date: moment(date).format(dateFormat)
    };
    coins.forEach(({ symbol, decimals, poolBalance, usdPrice }) => {
        const decimalMultiplier = 10 ** parseInt(decimals);
        dataPoint[symbol] = Math.floor(parseFloat(poolBalance) / decimalMultiplier) * Number(usdPrice);
    });
    return dataPoint;
}

const SocialLiquidityPoolChart = () => {

    // var balances = lp.balances as { coins: ICoinFromPoolDataApi[]; date: Date }[];
    // var underlyingBalances = lp.underlyingBalances as { coins: ICoinFromPoolDataApi[]; date: Date }[];

    // let chartBalances = (underlyingBalances.length > 0 && underlyingBalances[0].coins.length > 0)
    //     ? underlyingBalances : balances;

    // const hourlyData = getHourlyData(chartBalances).map(data =>
    //     lp.pricingType === LiquidityPoolPricingType.USD
    //         ? processData(data, "DD/MM HH:mm")
    //         : processUniswapData(data, "DD/MM HH:mm", lp));

    const csvData: ChartData[] = [
        {
            date: '2022-05-07T23:00:00+00:00',
            'UST': 6.27649424450131e+08,
            '3Pool': 2.359205774768202e+08
        },
        {
            date: '2022-05-07T22:00:00+00:00',
            'UST': 6.32515535505332e+08,
            '3Pool': 2.3438763549648657e+08
        },
        {
            date: '2022-05-07T21:00:00+00:00',
            'UST': 7.3490803155397e+08,
            '3Pool': 2.6552877402450737e+08
        },
        {
            date: '2022-05-07T20:00:00+00:00',
            'UST': 7.57045013543165e+08,
            '3Pool': 3.994274504793004e+08
        },
        {
            date: '2022-05-07T19:00:00+00:00',
            'UST': 7.42634991801895e+08,
            '3Pool': 4.187806378543127e+08
        },
        {
            date: '2022-05-07T18:00:00+00:00',
            'UST': 7.23906077731669e+08,
            '3Pool': 4.661527670778577e+08
        },
        {
            date: '2022-05-07T17:00:00+00:00',
            'UST': 6.91916728848924e+08,
            '3Pool': 5.1245348657742995e+08
        },
        {
            date: '2022-05-07T16:00:00+00:00',
            'UST': 6.89582270031432e+08,
            '3Pool': 5.1473808220794904e+08
        },
        {
            date: '2022-05-07T15:00:00+00:00',
            'UST': 6.89238663486412e+08,
            '3Pool': 5.196739242786923e+08
        },
        {
            date: '2022-05-07T14:00:00+00:00',
            'UST': 6.89586971086224e+08,
            '3Pool': 5.2034518863442427e+08
        },
        {
            date: '2022-05-07T13:00:00+00:00',
            'UST': 6.85536535826921e+08,
            '3Pool': 5.451197504534423e+08
        },
        {
            date: '2022-05-07T12:00:00+00:00',
            'UST': 6.85484904359391e+08,
            '3Pool': 5.455817715584328e+08
        },
        {
            date: '2022-05-07T11:00:00+00:00',
            'UST': 6.82429751360901e+08,
            '3Pool': 5.497102347298194e+08
        },
        {
            date: '2022-05-07T10:00:00+00:00',
            'UST': 6.752104026973e+08,
            '3Pool': 5.56773307475778e+08
        },
        {
            date: '2022-05-07T09:00:00+00:00',
            'UST': 6.77057226184301e+08,
            '3Pool': 5.550628687177367e+08
        },
        {
            date: '2022-05-07T08:00:00+00:00',
            'UST': 6.74063382739822e+08,
            '3Pool': 5.579919497048678e+08
        },
        {
            date: '2022-05-07T06:00:00+00:00',
            'UST': 6.71778675628217e+08,
            '3Pool': 5.623039860798273e+08
        },
        {
            date: '2022-05-07T05:00:00+00:00',
            'UST': 6.71169552443965e+08,
            '3Pool': 5.62878664041726e+08
        },
        {
            date: '2022-05-07T04:00:00+00:00',
            'UST': 6.66163630230138e+08,
            '3Pool': 5.679243524196502e+08
        },
        {
            date: '2022-05-07T03:00:00+00:00',
            'UST': 6.65901262413428e+08,
            '3Pool': 5.681810249178494e+08
        },
        {
            date: '2022-05-07T02:00:00+00:00',
            'UST': 6.6490128803591e+08,
            '3Pool': 5.691591621748434e+08
        },
        {
            date: '2022-05-07T01:00:00+00:00',
            'UST': 6.65119717264175e+08,
            '3Pool': 5.689452447978799e+08
        },
        {
            date: '2022-05-07T00:00:00+00:00',
            'UST': 6.65119717264175e+08,
            '3Pool': 5.681863368405988e+08
        },
        {
            date: '2022-05-08T23:00:00+00:00',
            'UST': 5.42602820265822e+08,
            '3Pool': 2.7449739465364283e+08
        },
        {
            date: '2022-05-08T22:00:00+00:00',
            'UST': 5.3714054795794e+08,
            '3Pool': 2.798156656715701e+08
        },
        {
            date: '2022-05-08T21:00:00+00:00',
            'UST': 5.25114612397494e+08,
            '3Pool': 2.726267159012444e+08
        },
        {
            date: '2022-05-08T20:00:00+00:00',
            'UST': 5.37059046994068e+08,
            '3Pool': 2.805504213130866e+08
        },
        {
            date: '2022-05-08T19:00:00+00:00',
            'UST': 5.32996249546962e+08,
            '3Pool': 2.649236452492953e+08
        },
        {
            date: '2022-05-08T18:00:00+00:00',
            'UST': 5.29259795557168e+08,
            '3Pool': 2.6855698676848763e+08
        },
        {
            date: '2022-05-08T17:00:00+00:00',
            'UST': 5.24033644131582e+08,
            '3Pool': 2.7363522667464703e+08
        },
        {
            date: '2022-05-08T16:00:00+00:00',
            'UST': 4.91270051054595e+08,
            '3Pool': 3.0562266605368936e+08
        },
        {
            date: '2022-05-08T15:00:00+00:00',
            'UST': 4.73959957630702e+08,
            '3Pool': 3.225302648713435e+08
        },
        {
            date: '2022-05-08T14:00:00+00:00',
            'UST': 4.66449167823059e+08,
            '3Pool': 3.946932836330909e+08
        },
        {
            date: '2022-05-08T13:00:00+00:00',
            'UST': 5.85335879241793e+08,
            '3Pool': 2.1997892432203594e+08
        },
        {
            date: '2022-05-08T12:00:00+00:00',
            'UST': 5.83983100544058e+08,
            '3Pool': 2.2163956290943527e+08
        },
        {
            date: '2022-05-08T11:00:00+00:00',
            'UST': 5.76915475669275e+08,
            '3Pool': 2.2858781302761394e+08
        },
        {
            date: '2022-05-08T10:00:00+00:00',
            'UST': 5.72494836338237e+08,
            '3Pool': 2.3285406324611282e+08
        },
        {
            date: '2022-05-08T09:00:00+00:00',
            'UST': 5.66154427828082e+08,
            '3Pool': 2.3988904901384315e+08
        },
        {
            date: '2022-05-08T08:00:00+00:00',
            'UST': 5.39234448182765e+08,
            '3Pool': 2.6707625351617807e+08
        },
        {
            date: '2022-05-08T07:00:00+00:00',
            'UST': 5.28624275325226e+08,
            '3Pool': 2.7745377449927545e+08
        },
        {
            date: '2022-05-08T06:00:00+00:00',
            'UST': 5.25944387204963e+08,
            '3Pool': 2.7810378136841965e+08
        },
        {
            date: '2022-05-08T05:00:00+00:00',
            'UST': 4.84378278581404e+08,
            '3Pool': 3.193303028390971e+08
        },
        {
            date: '2022-05-08T04:00:00+00:00',
            'UST': 4.82588146662374e+08,
            '3Pool': 3.2835382226816106e+08
        },
        {
            date: '2022-05-08T03:00:00+00:00',
            'UST': 5.31739811973903e+08,
            '3Pool': 2.8038526080452114e+08
        },
        {
            date: '2022-05-08T02:00:00+00:00',
            'UST': 6.24377913547332e+08,
            '3Pool': 2.4997132358726344e+08
        },
        {
            date: '2022-05-08T01:00:00+00:00',
            'UST': 6.3923641460698e+08,
            '3Pool': 1.9121924762721577e+08
        },
        {
            date: '2022-05-08T00:00:00+00:00',
            'UST': 6.41033360018283e+08,
            '3Pool': 2.2279744303785822e+08
        },
        {
            date: '2022-05-09T23:00:00+00:00',
            'UST': 7.19639442796959e+08,
            '3Pool': 3.391152091298848e+07
        },
        {
            date: '2022-05-09T22:00:00+00:00',
            'UST': 6.99440064664099e+08,
            '3Pool': 5.0968058551222056e+07
        },
        {
            date: '2022-05-09T21:00:00+00:00',
            'UST': 7.00850316560691e+08,
            '3Pool': 5.386609993929538e+07
        },
        {
            date: '2022-05-09T20:00:00+00:00',
            'UST': 6.81641917566329e+08,
            '3Pool': 7.128119986537164e+07
        },
        {
            date: '2022-05-09T19:00:00+00:00',
            'UST': 6.82877258763795e+08,
            '3Pool': 7.078376087730196e+07
        },
        {
            date: '2022-05-09T18:00:00+00:00',
            'UST': 6.93747251380631e+08,
            '3Pool': 7.338250082158671e+07
        },
        {
            date: '2022-05-09T17:00:00+00:00',
            'UST': 6.53774997395796e+08,
            '3Pool': 1.1902006462541533e+08
        },
        {
            date: '2022-05-09T16:00:00+00:00',
            'UST': 6.51291630503428e+08,
            '3Pool': 1.4329930052012622e+08
        },
        {
            date: '2022-05-09T15:00:00+00:00',
            'UST': 6.33800531106091e+08,
            '3Pool': 1.5374295838877645e+08
        },
        {
            date: '2022-05-09T14:00:00+00:00',
            'UST': 6.16207523203306e+08,
            '3Pool': 1.7389352116041157e+08
        },
        {
            date: '2022-05-09T13:00:00+00:00',
            'UST': 5.87880298967793e+08,
            '3Pool': 2.0135061698428583e+08
        },
        {
            date: '2022-05-09T12:00:00+00:00',
            'UST': 5.54939819644907e+08,
            '3Pool': 2.4109628423769686e+08
        },
        {
            date: '2022-05-09T11:00:00+00:00',
            'UST': 5.51325724338361e+08,
            '3Pool': 2.5631294443022704e+08
        },
        {
            date: '2022-05-09T10:00:00+00:00',
            'UST': 5.34784503259661e+08,
            '3Pool': 2.7231860880462044e+08
        },
        {
            date: '2022-05-09T09:00:00+00:00',
            'UST': 5.44069703682135e+08,
            '3Pool': 2.634002703162471e+08
        },
        {
            date: '2022-05-09T08:00:00+00:00',
            'UST': 5.53545436284886e+08,
            '3Pool': 2.481996032565669e+08
        },
        {
            date: '2022-05-09T07:00:00+00:00',
            'UST': 5.46912412357048e+08,
            '3Pool': 2.546631955253834e+08
        },
        {
            date: '2022-05-09T06:00:00+00:00',
            'UST': 5.45564189602177e+08,
            '3Pool': 2.5597725021883982e+08
        },
        {
            date: '2022-05-09T05:00:00+00:00',
            'UST': 5.46686190757636e+08,
            '3Pool': 2.5486249229969472e+08
        },
        {
            date: '2022-05-09T04:00:00+00:00',
            'UST': 5.51544052094964e+08,
            '3Pool': 2.5008450276111042e+08
        },
        {
            date: '2022-05-09T03:00:00+00:00',
            'UST': 5.29851968581441e+08,
            '3Pool': 2.6695512220048594e+08
        },
        {
            date: '2022-05-09T02:00:00+00:00',
            'UST': 5.31545504803804e+08,
            '3Pool': 2.656123359681506e+08
        },
        {
            date: '2022-05-09T01:00:00+00:00',
            'UST': 5.1653387568375e+08,
            '3Pool': 2.803691633227057e+08
        },
        {
            date: '2022-05-09T00:00:00+00:00',
            'UST': 5.44813883718748e+08,
            '3Pool': 2.723410120233465e+08
        },
        {
            date: '2022-05-10T23:00:00+00:00',
            'UST': 6.60972352706006e+08,
            '3Pool': 3.316253745352501e+07
        },
        {
            date: '2022-05-10T22:00:00+00:00',
            'UST': 6.70111100090841e+08,
            '3Pool': 2.653294518973926e+07
        },
        {
            date: '2022-05-10T21:00:00+00:00',
            'UST': 6.95481613902609e+08,
            '3Pool': 3.232845466963503e+07
        },
        {
            date: '2022-05-10T20:00:00+00:00',
            'UST': 6.70711877909581e+08,
            '3Pool': 5.317778429439596e+07
        },
        {
            date: '2022-05-10T19:00:00+00:00',
            'UST': 6.68719022858309e+08,
            '3Pool': 5.496556910622557e+07
        },
        {
            date: '2022-05-10T18:00:00+00:00',
            'UST': 6.6591912702739e+08,
            '3Pool': 5.757078785714372e+07
        },
        {
            date: '2022-05-10T17:00:00+00:00',
            'UST': 6.67094966966396e+08,
            '3Pool': 5.6503771517749846e+07
        },
        {
            date: '2022-05-10T16:00:00+00:00',
            'UST': 6.73053117884103e+08,
            '3Pool': 5.302176796416996e+07
        },
        {
            date: '2022-05-10T15:00:00+00:00',
            'UST': 6.72216460697249e+08,
            '3Pool': 5.37729668668284e+07
        },
        {
            date: '2022-05-10T14:00:00+00:00',
            'UST': 6.76807702241849e+08,
            '3Pool': 5.4500629213974066e+07
        },
        {
            date: '2022-05-10T13:00:00+00:00',
            'UST': 6.67421534571186e+08,
            '3Pool': 6.2908718932970144e+07
        },
        {
            date: '2022-05-10T12:00:00+00:00',
            'UST': 6.69864156147733e+08,
            '3Pool': 6.077050286721968e+07
        },
        {
            date: '2022-05-10T11:00:00+00:00',
            'UST': 6.71537722571156e+08,
            '3Pool': 5.925809513613347e+07
        },
        {
            date: '2022-05-10T10:00:00+00:00',
            'UST': 6.76539118417343e+08,
            '3Pool': 5.4747893215248056e+07
        },
        {
            date: '2022-05-10T09:00:00+00:00',
            'UST': 6.77802382349532e+08,
            '3Pool': 5.376557259208937e+07
        },
        {
            date: '2022-05-10T08:00:00+00:00',
            'UST': 6.72261152822552e+08,
            '3Pool': 5.8795355135822155e+07
        },
        {
            date: '2022-05-10T07:00:00+00:00',
            'UST': 6.79359716270636e+08,
            '3Pool': 5.2875975405168645e+07
        },
        {
            date: '2022-05-10T06:00:00+00:00',
            'UST': 6.63600412760196e+08,
            '3Pool': 6.869346781681147e+07
        },
        {
            date: '2022-05-10T05:00:00+00:00',
            'UST': 6.80666399890467e+08,
            '3Pool': 5.337825738782921e+07
        },
        {
            date: '2022-05-10T04:00:00+00:00',
            'UST': 7.05874069414114e+08,
            '3Pool': 4.265307455674359e+07
        },
        {
            date: '2022-05-10T03:00:00+00:00',
            'UST': 7.20280510575818e+08,
            '3Pool': 3.221956565791807e+07
        },
        {
            date: '2022-05-10T02:00:00+00:00',
            'UST': 7.20670629411689e+08,
            '3Pool': 3.1894508141714633e+07
        },
        {
            date: '2022-05-10T01:00:00+00:00',
            'UST': 7.15690269646379e+08,
            '3Pool': 3.5641546455289155e+07
        },
        {
            date: '2022-05-10T00:00:00+00:00',
            'UST': 7.17367298828469e+08,
            '3Pool': 3.482617613710667e+07
        },
        // {
        //     date: '2022-05-11T23:00:00+00:00',
        //     'UST': 2.98528173835792e+08,
        //     '3Pool': 1.646046414745188e+07
        // },
        // {
        //     date: '2022-05-11T22:00:00+00:00',
        //     'UST': 3.04738953029459e+08,
        //     '3Pool': 1.501725844953963e+07
        // },
        {
            date: '2022-05-11T21:00:00+00:00',
            'UST': 3.12942471548461e+08,
            '3Pool': 1.3860210301557437e+07
        },
        {
            date: '2022-05-11T20:00:00+00:00',
            'UST': 3.16188139933575e+08,
            '3Pool': 1.2296758084462777e+07
        },
        {
            date: '2022-05-11T19:00:00+00:00',
            'UST': 3.17696612750602e+08,
            '3Pool': 1.1263862575698985e+07
        },
        {
            date: '2022-05-11T18:00:00+00:00',
            'UST': 3.26488077265463e+08,
            '3Pool': 1.1251419786838196e+07
        },
        {
            date: '2022-05-11T17:00:00+00:00',
            'UST': 3.25560946068259e+08,
            '3Pool': 1.1858092844569592e+07
        },
        {
            date: '2022-05-11T16:00:00+00:00',
            'UST': 3.26521822251326e+08,
            '3Pool': 1.1589945155494235e+07
        },
        {
            date: '2022-05-11T15:00:00+00:00',
            'UST': 3.3337639121161e+08,
            '3Pool': 1.0394204864753023e+07
        },
        {
            date: '2022-05-11T14:00:00+00:00',
            'UST': 3.37247151451903e+08,
            '3Pool': 8.239968331212729e+06
        },
        {
            date: '2022-05-11T13:00:00+00:00',
            'UST': 3.46733430854595e+08,
            '3Pool': 7.847805319248684e+06
        },
        {
            date: '2022-05-11T12:00:00+00:00',
            'UST': 3.57142755614652e+08,
            '3Pool': 5.289137519056613e+06
        },
        {
            date: '2022-05-11T11:00:00+00:00',
            'UST': 3.51123885951058e+08,
            '3Pool': 7.457840650225335e+06
        },
        {
            date: '2022-05-11T10:00:00+00:00',
            'UST': 3.55069629894963e+08,
            '3Pool': 8.850057369466268e+06
        },
        {
            date: '2022-05-11T09:00:00+00:00',
            'UST': 3.55992911454643e+08,
            '3Pool': 8.317956776890921e+06
        },
        {
            date: '2022-05-11T08:00:00+00:00',
            'UST': 3.66514797775661e+08,
            '3Pool': 9.382937211315e+06
        },
        {
            date: '2022-05-11T07:00:00+00:00',
            'UST': 3.74183231297817e+08,
            '3Pool': 7.546671473528004e+06
        },
        {
            date: '2022-05-11T06:00:00+00:00',
            'UST': 6.62824483094888e+08,
            '3Pool': 1.6986357193667963e+07
        },
        {
            date: '2022-05-11T05:00:00+00:00',
            'UST': 6.59476887236988e+08,
            '3Pool': 2.520039212739025e+07
        },
        {
            date: '2022-05-11T04:00:00+00:00',
            'UST': 6.64028767018592e+08,
            '3Pool': 3.008771413950588e+07
        },
        {
            date: '2022-05-11T03:00:00+00:00',
            'UST': 6.54443868433732e+08,
            '3Pool': 3.757854613295539e+07
        },
        {
            date: '2022-05-11T02:00:00+00:00',
            'UST': 6.51780977840643e+08,
            '3Pool': 3.988487491122408e+07
        },
        {
            date: '2022-05-11T01:00:00+00:00',
            'UST': 6.62629731018822e+08,
            '3Pool': 3.183103175860573e+07
        },
        {
            date: '2022-05-11T00:00:00+00:00',
            'UST': 6.59742119158861e+08,
            '3Pool': 3.4056011354042664e+07
        },
    ];

    // function mapChartData(data: ChartData[]): ChartData[] {
    //     return data.map((point) => {
    //         return {
    //             ...point,
    //             date: moment(point.date).format("DD/MM HH:mm")
    //         };
    //     });

    let chartData = csvData.map((point) => {
        return {
            ...point,
            date: moment(point.date).format("DD/MM HH:mm")
        };
    }).sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())


    let coins: string[] = ['UST', '3Pool'];

    let theme = useTheme();
    // let availableColors = [
    //     "#ffa600",
    //     "#a05195",
    //     "#ff7c43",
    //     "#665191",
    //     "#003f5c",
    //     "#f95d6a",
    //     "#d45087",
    //     "#2f4b7c",
    // ]
    let availableColors = [
        "#ffa600",
        "#a05195",
        "#d45087",
        "#2f4b7c",
    ]
    let coinToColorMap = new Map(coins.map((coin, index) => [coin, availableColors[index]]));

    if (chartData.length < 4) {
        return <Box />
    }

    return (
        <Box
            sx={() => ({
                width: '1',
                mt: 2,
                p: 1,
            })}>
            <ResponsiveContainer width="100%" height={500}>
                <AreaChart
                    data={chartData} >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}

                    <XAxis dataKey="date"
                        height={55}
                        tickFormatter={(value) => {
                            return moment(value).format('HH:00')
                        }}
                        tick={{ fill: theme.palette.text.primary }}
                        tickMargin={16}
                        angle={-35}
                        interval='preserveEnd'

                    />
                    <YAxis
                        type="number"
                        tickMargin={15}
                        tick={{ fill: theme.palette.text.primary }}
                        tickFormatter={(value) =>
                            new Intl.NumberFormat("en-US", {
                                notation: "compact",
                                compactDisplay: "short",
                            }).format(value)}
                    />
                    <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper }}
                        formatter={(value: any) => {
                            return currencyFormat(value);
                        }}
                        labelFormatter={(value: any) => {
                            return moment(value).format('DD/MM HH:00');
                        }}
                    />
                    <Legend />

                    {coins.map((coin) => {
                        return (
                            <Area
                                type="monotone"
                                dataKey={coin}
                                stackId="1"
                                stroke={coinToColorMap.get(coin)}
                                fill={coinToColorMap.get(coin)}
                            />
                        );
                    })}

                    {/* <ReferenceLine x="07/05 21:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2}>
                    </ReferenceLine>
                    <ReferenceLine x="07/05 22:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2}>
                    </ReferenceLine>
                    <ReferenceLine x="07/05 23:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2}>
                    </ReferenceLine>

                    <ReferenceLine x="08/05 13:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2}>
                    </ReferenceLine>

                    <ReferenceLine x="09/05 13:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2}>
                    </ReferenceLine>
                    <ReferenceLine x="09/05 14:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2} >
                    </ReferenceLine>
                    <ReferenceLine x="09/05 15:00" opacity={0.8} stroke="red" strokeDasharray="3 3" strokeWidth={2} >
                    </ReferenceLine> */}

                    <ReferenceLine x="08/05 00:00" opacity={0.8} stroke="white" strokeDasharray="3 3" strokeWidth={2}>
                        <Label position='insideTopLeft' fill='white' opacity={0.8}>08/05</Label>
                    </ReferenceLine>
                    <ReferenceLine x="09/05 00:00" opacity={0.8} stroke="white" strokeDasharray="3 3" strokeWidth={2}>
                        <Label position='insideTopLeft' fill='white' opacity={0.8}>09/05</Label>
                    </ReferenceLine>
                    <ReferenceLine x="10/05 00:00" opacity={0.8} stroke="white" strokeDasharray="3 3" strokeWidth={2}>
                        <Label position='insideTopLeft' fill='white' opacity={0.8}>10/05</Label>
                    </ReferenceLine>
                    <ReferenceLine x="11/05 00:00" opacity={0.8} stroke="white" strokeDasharray="3 3" strokeWidth={2}>
                        <Label position='insideTopLeft' fill='white' opacity={0.8}>11/05</Label>
                    </ReferenceLine>
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}


export default SocialLiquidityPoolChart; 