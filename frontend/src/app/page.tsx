'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';

export default function CryptoDashboard() {
  const portfolioValue = 125430.5;
  const totalChange = 12543.5;
  const changePercentage = 11.1;

  const cryptoData = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 43250.0,
      change: 2.5,
      changeType: 'up',
      balance: 0.5,
      value: 21625.0,
      icon: '₿',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2650.0,
      change: -1.2,
      changeType: 'down',
      balance: 2.0,
      value: 53300.0,
      icon: 'Ξ',
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.45,
      change: 5.8,
      changeType: 'up',
      balance: 1000,
      value: 4250.0,
      icon: '₳',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 98.5,
      change: 3.2,
      changeType: 'up',
      balance: 15,
      value: 21477.5,
      icon: '◎',
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      price: 6.8,
      change: -0.8,
      changeType: 'down',
      balance: 50,
      value: 340.0,
      icon: '●',
    },
  ];

  const recentTransactions = [
    {
      type: 'Buy',
      asset: 'Bitcoin',
      amount: '0.1 BTC',
      value: '$4,325',
      time: '2 hours ago',
      status: 'Completed',
    },
    {
      type: 'Sell',
      asset: 'Ethereum',
      amount: '0.5 ETH',
      value: '$1,325',
      time: '5 hours ago',
      status: 'Completed',
    },
    {
      type: 'Buy',
      asset: 'Solana',
      amount: '10 SOL',
      value: '$985',
      time: '1 day ago',
      status: 'Completed',
    },
    {
      type: 'Buy',
      asset: 'Cardano',
      amount: '500 ADA',
      value: '$225',
      time: '2 days ago',
      status: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <div className="container mx-auto p-6 space-y-6">
        {/* Chart */}
        <ChartAreaInteractive data={cryptoData} />

        {/* Portfolio Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-black border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Portfolio
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ color: 'oklch(70.8% 0 0)' }}
              >
                ${portfolioValue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-gray-400">
                {changePercentage > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    changePercentage > 0 ? 'text-green-500' : 'text-red-500'
                  }
                >
                  +${totalChange.toLocaleString()} ({changePercentage}%)
                </span>
                <span className="ml-1 text-gray-400">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Active Assets
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ color: 'oklch(70.8% 0 0)' }}
              >
                {cryptoData.length}
              </div>
              <p className="text-xs text-gray-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                24h Volume
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ color: 'oklch(70.8% 0 0)' }}
              >
                $12,543
              </div>
              <p className="text-xs text-gray-400">+8.2% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Market Cap
              </CardTitle>
              <PieChart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ color: 'oklch(70.8% 0 0)' }}
              >
                $1.2T
              </div>
              <p className="text-xs text-gray-400">+2.1% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Portfolio Holdings */}
          <Card className="col-span-4 bg-black border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Portfolio Holdings</CardTitle>
              <CardDescription className="text-gray-400">
                Your current cryptocurrency holdings and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cryptoData.map((crypto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-black"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {crypto.icon}
                        </span>
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: 'oklch(70.8% 0 0)' }}
                        >
                          {crypto.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-medium"
                        style={{ color: 'oklch(70.8% 0 0)' }}
                      >
                        ${crypto.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {crypto.balance} {crypto.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-medium"
                        style={{ color: 'oklch(70.8% 0 0)' }}
                      >
                        ${crypto.price.toLocaleString()}
                      </div>
                      <div
                        className={`text-sm flex items-center ${
                          crypto.changeType === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {crypto.changeType === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(crypto.change)}%
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Trade</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3 bg-black border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest transactions and portfolio updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'Buy'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'Buy' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: 'oklch(70.8% 0 0)' }}
                        >
                          {transaction.type} {transaction.asset}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.amount}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-medium"
                        style={{ color: 'oklch(70.8% 0 0)' }}
                      >
                        {transaction.value}
                      </div>
                      <div className="text-sm text-gray-400">
                        {transaction.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Market Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Top performing cryptocurrencies in the market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 gap-2 bg-black border-gray-700">
                <TabsTrigger
                  value="all"
                  className="border border-gray-700 rounded-md px-3 py-2 text-gray-300 data-[state=active]:bg-gray-700/50 data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="gainers"
                  className="border border-gray-700 rounded-md px-3 py-2 text-gray-300 data-[state=active]:bg-gray-700/50 data-[state=active]:text-white"
                >
                  Gainers
                </TabsTrigger>
                <TabsTrigger
                  value="losers"
                  className="border border-gray-700 rounded-md px-3 py-2 text-gray-300 data-[state=active]:bg-gray-700/50 data-[state=active]:text-white"
                >
                  Losers
                </TabsTrigger>
                <TabsTrigger
                  value="volume"
                  className="border border-gray-700 rounded-md px-3 py-2 text-gray-300 data-[state=active]:bg-gray-700/50 data-[state=active]:text-white"
                >
                  Volume
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Asset</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">
                        24h Change
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Market Cap
                      </TableHead>
                      <TableHead className="text-gray-300">Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cryptoData.map((crypto, index) => (
                      <TableRow key={index} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {crypto.icon}
                              </span>
                            </div>
                            <div>
                              <div
                                className="font-medium"
                                style={{ color: 'oklch(70.8% 0 0)' }}
                              >
                                {crypto.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {crypto.symbol}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="font-medium"
                          style={{ color: 'oklch(70.8% 0 0)' }}
                        >
                          ${crypto.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              crypto.changeType === 'up'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {crypto.changeType === 'up' ? '+' : ''}
                            {crypto.change}%
                          </Badge>
                        </TableCell>
                        <TableCell style={{ color: 'oklch(70.8% 0 0)' }}>
                          $45.2B
                        </TableCell>
                        <TableCell style={{ color: 'oklch(70.8% 0 0)' }}>
                          $2.1B
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
