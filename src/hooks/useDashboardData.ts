import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";

export interface DashboardMetrics {
  store: {
    total: {
      totalRevenue: number; // Receita total (produtos + frete + taxas)
      shippingRevenue: number; // Total pago em frete
      pixRevenue: number; // Total transacionado por PIX
      creditCardRevenue: number; // Total transacionado por cartão
      averageTicket: number; // Ticket médio
      totalOrders: number; // Quantidade de pedidos
      activeProducts: number; // Total de produtos ativos
      commissionsPaid: number; // Total de comissões pagas
      productsSold: number; // Quantidade total de produtos vendidos
      totalProductsCreated: number; // Total de produtos criados (todos os status)
      productsApproved: number; // Produtos aprovados
      productsRejected: number; // Produtos rejeitados
      productsPending: number; // Produtos pendentes
      productsInactive: number; // Produtos inativos
      ordersPending: number; // Pedidos pendentes
      ordersPaid: number; // Pedidos pagos
      ordersFactory: number; // Pedidos em produção
      ordersShipped: number; // Pedidos enviados
      ordersDelivered: number; // Pedidos entregues
      ordersCanceled: number; // Pedidos cancelados
      topProductsSold: Array<{
        // Top 10 produtos mais vendidos
        productId: string;
        productName: string;
        saleQuantity: number;
        percentage: number;
      }>;
      topStreamersSales: Array<{
        // Top 10 criadores que mais venderam
        streamerId: string;
        streamerName: string;
        totalSales: number;
        totalRevenue: number;
        percentage: number;
      }>;
    };
    last30Days: {
      totalRevenue: number; // Receita total dos últimos 30 dias
      shippingRevenue: number;
      pixRevenue: number;
      creditCardRevenue: number;
      averageTicket: number;
      totalOrders: number;
      activeProducts: number; // Mesmo valor (produtos ativos não muda)
      commissionsPaid: number; // Comissões pagas nos últimos 30 dias
      productsSold: number; // Produtos vendidos nos últimos 30 dias
      totalProductsCreated: number; // Total de produtos criados (todos os status)
      productsApproved: number; // Produtos aprovados
      productsRejected: number; // Produtos rejeitados
      productsPending: number; // Produtos pendentes
      productsInactive: number; // Produtos inativos
      ordersPending: number; // Pedidos pendentes últimos 30 dias
      ordersPaid: number; // Pedidos pagos últimos 30 dias
      ordersFactory: number; // Pedidos em produção últimos 30 dias
      ordersShipped: number; // Pedidos enviados últimos 30 dias
      ordersDelivered: number; // Pedidos entregues últimos 30 dias
      ordersCanceled: number; // Pedidos cancelados últimos 30 dias
      topProductsSold: Array<{
        // Top 10 produtos mais vendidos últimos 30 dias
        productId: string;
        productName: string;
        saleQuantity: number;
        percentage: number;
      }>;
      topStreamersSales: Array<{
        // Top 10 criadores que mais venderam
        streamerId: string;
        streamerName: string;
        totalSales: number;
        totalRevenue: number;
        percentage: number;
      }>;
    };
  };
  donations: {
    total: {
      totalDonations: number; // Total de doações (quantidade)
      totalAmount: number; // Valor total arrecadado
      averageDonation: number; // Média por doação
      highestDonation: number; // Maior doação
      topStreamers: Array<{ name: string; amount: number }>;
    };
    last30Days: {
      totalDonations: number;
      totalAmount: number;
      averageDonation: number;
      highestDonation: number;
      topStreamers: Array<{ name: string; amount: number }>;
    };
  };
  users: {
    total: {
      totalUsers: number;
      totalStreamers: number;
      usersActive: number;
      usersInactive: number;
      usersBlocked: number;
      usersUnblocked: number;
      streamersWithProducts: number;
    };
    last30Days: {
      totalUsers: number;
      totalStreamers: number;
      usersActive: number;
      usersInactive: number;
      usersBlocked: number;
      usersUnblocked: number;
      newUsers: number;
      streamersWithProducts: number;
    };
  };
  streamers: {
    total: {
      totalStreamers: number;
      streamersPublic: number;
      streamersPrivate: number;
      streamersWithProducts: number;
      requestsPending: number;
      requestsApproved: number;
      requestsRejected: number;
      topCreators: Array<{
        streamerId: string;
        streamerName: string;
        productCount: number;
      }>;
    };
    last30Days: {
      totalStreamers: number;
      streamersPublic: number;
      streamersPrivate: number;
      streamersWithProducts: number;
      requestsPending: number;
      requestsApproved: number;
      requestsRejected: number;
      newStreamers: number;
      topCreators: Array<{
        streamerId: string;
        streamerName: string;
        productCount: number;
      }>;
    };
  };
  baseProducts: {
    total: {
      totalBaseProducts: number;
      baseProductsActive: number;
      baseProductsInactive: number;
    };
    last30Days: {
      totalBaseProducts: number;
      baseProductsActive: number;
      baseProductsInactive: number;
    };
  };
  topProductsUsage: {
    total: {
      topProductsUsage: Array<{
        productId: number;
        productName: string;
        usageCount: number;
        percentage: number;
      }>;
      topProductsSold: Array<{
        productId: string;
        productName: string;
        saleQuantity: number;
        percentage: number;
      }>;
    };
    last30Days: {
      topProductsUsage: Array<{
        productId: number;
        productName: string;
        usageCount: number;
        percentage: number;
      }>;
      topProductsSold: Array<{
        productId: string;
        productName: string;
        saleQuantity: number;
        percentage: number;
      }>;
    };
  };
  pendingRequests: {
    withdrawalRequests: number;
    streamerRequests: number;
    productStreamerRequests: number;
    orderCancelRequests: number;
  };
  operational: {
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    canceledOrders: number;
    pendingWithdrawals: number;
    ordersFactory24h: number;
    missingData: {
      supportTickets: string;
    };
  };
  wallets: {
    total: {
      storeBalanceReleased: number;
      storeBalancePending: number;
      donationBalanceReleased: number;
      donationBalancePending: number;
    };
    last30Days: {
      storeBalanceReleased: number;
      storeBalancePending: number;
      donationBalanceReleased: number;
      donationBalancePending: number;
    };
  };
  withdrawals: {
    total: {
      completed: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
      pending: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
    };
    last30Days: {
      completed: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
      pending: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
    };
  };
}

export const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataProvider = useDataProvider();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Data atual para filtros
      const now = new Date();
      const now30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Buscar dados em paralelo
      const [
        usersData,
        streamersData,
        donationsData,
        ordersData,
        productsData,
        productStreamersData,
        commissionsData,
        withdrawalsData,
        walletsData,
        streamerRequestsData,
        orderCancelData,
      ] = await Promise.all([
        // Usuários
        dataProvider.getList("users", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
        // Streamers
        dataProvider.getList("streamers", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
        // Doações
        dataProvider.getList("donations", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
        // Pedidos
        dataProvider.getList("orders", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
        // Produtos
        dataProvider.getList("products", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
        // Produtos dos streamers
        dataProvider.getList("product-streamer", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
        // Comissões
        dataProvider.getList("commission-streamer", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
        // Saques
        dataProvider.getList("withdrawal-requests", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
        // Carteiras (para saldo disponível)
        dataProvider.getList("wallets", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        }),
        // Solicitações de streamers
        dataProvider.getList("streamer-requests", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
        // Cancelamentos de pedidos
        dataProvider.getList("order-cancel", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "createdAt", order: "DESC" },
          filter: {},
        }),
      ]);

      // Processar dados de usuários
      const newUsers30d = usersData.data.filter(
        (user: any) => new Date(user.createdAt) > now30DaysAgo,
      ).length;

      // Calcular usuários por status (true/false para active e blocked)
      const usersActive = usersData.data.filter(
        (user: any) => user.active === true,
      ).length;
      const usersInactive = usersData.data.filter(
        (user: any) => user.active === false || !user.active,
      ).length;
      const usersBlocked = usersData.data.filter(
        (user: any) => user.blocked === true,
      ).length;
      const usersUnblocked = usersData.data.filter(
        (user: any) => user.blocked === false || !user.blocked,
      ).length;

      // Calcular usuários dos últimos 30 dias por status
      const users30d = usersData.data.filter(
        (user: any) => new Date(user.createdAt) > now30DaysAgo,
      );
      const usersActive30d = users30d.filter(
        (user: any) => user.active === true,
      ).length;
      const usersInactive30d = users30d.filter(
        (user: any) => user.active === false || !user.active,
      ).length;
      const usersBlocked30d = users30d.filter(
        (user: any) => user.blocked === true,
      ).length;
      const usersUnblocked30d = users30d.filter(
        (user: any) => user.blocked === false || !user.blocked,
      ).length;

      const streamersWithProducts = productStreamersData.data
        .filter((ps: any) => ps.status === "ACTIVE" || ps.status === "active") // Apenas produtos ativos
        .map((ps: any) => ps.streamerId)
        .filter(
          (value: any, index: number, self: any[]) =>
            self.indexOf(value) === index,
        ).length;

      // Processar dados de streamers (criadores)
      const streamersPublic = streamersData.data.filter(
        (streamer: any) => streamer.public === true,
      ).length;
      const streamersPrivate = streamersData.data.filter(
        (streamer: any) => streamer.public === false || !streamer.public,
      ).length;

      const newStreamers30d = streamersData.data.filter(
        (streamer: any) => new Date(streamer.createdAt) > now30DaysAgo,
      ).length;

      // Processar solicitações de streamers (usando dados reais)
      const requestsPending = streamerRequestsData.data.filter(
        (req: any) => req.status === "PENDING",
      ).length;
      const requestsApproved = streamerRequestsData.data.filter(
        (req: any) => req.status === "APPROVED",
      ).length;
      const requestsRejected = streamerRequestsData.data.filter(
        (req: any) => req.status === "REJECTED",
      ).length;

      // Solicitações dos últimos 30 dias
      const requests30d = streamerRequestsData.data.filter(
        (req: any) => new Date(req.createdAt) > now30DaysAgo,
      );
      const requestsPending30d = requests30d.filter(
        (req: any) => req.status === "PENDING",
      ).length;
      const requestsApproved30d = requests30d.filter(
        (req: any) => req.status === "APPROVED",
      ).length;
      const requestsRejected30d = requests30d.filter(
        (req: any) => req.status === "REJECTED",
      ).length;

      // === CALCULAR SOLICITAÇÕES PENDENTES ===

      // Withdrawal Requests pendentes
      const withdrawalRequestsPending = withdrawalsData.data.filter(
        (req: any) => req.status === "PENDING" || req.status === "pending",
      ).length;

      // Streamer Requests pendentes (já calculado acima)
      const streamerRequestsPending = requestsPending;

      // Product-Streamer pendentes
      const productStreamerPending = productStreamersData.data.filter(
        (ps: any) => ps.status === "PENDING" || ps.status === "pending",
      ).length;

      // Order-Cancel pendentes
      const orderCancelPending = orderCancelData.data.filter(
        (oc: any) => oc.status === "PENDING" || oc.status === "pending",
      ).length;

      // === PROCESSAR STATUS DOS PRODUTOS ===

      // Verificar todos os status únicos que existem
      const uniqueStatuses = [
        ...new Set(productStreamersData.data.map((p: any) => p.status)),
      ];

      // Calcular status dos produtos baseado em product-streamer
      const productsByStatus = productStreamersData.data.reduce(
        (acc: any, product: any) => {
          const status = product.status || "NO_STATUS";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {},
      );

      const totalProductsCreated = productStreamersData.data.length;

      // Mapear status possíveis (tentar todas as variações)
      const productsApproved =
        productsByStatus["ACTIVE"] ||
        productsByStatus["active"] ||
        productsByStatus["APPROVED"] ||
        productsByStatus["approved"] ||
        productsByStatus["ENABLED"] ||
        productsByStatus["enabled"] ||
        0;

      const productsRejected =
        productsByStatus["REJECTED"] ||
        productsByStatus["rejected"] ||
        productsByStatus["REFUSED"] ||
        productsByStatus["refused"] ||
        productsByStatus["DENIED"] ||
        0;

      const productsPending =
        productsByStatus["PENDING"] ||
        productsByStatus["pending"] ||
        productsByStatus["WAITING"] ||
        productsByStatus["waiting"] ||
        productsByStatus["REVIEW"] ||
        0;

      const productsInactive =
        productsByStatus["INACTIVE"] ||
        productsByStatus["inactive"] ||
        productsByStatus["DISABLED"] ||
        productsByStatus["disabled"] ||
        productsByStatus["NO_STATUS"] ||
        0;

      // Calcular status dos produtos base
      const baseProductsByStatus = productsData.data.reduce(
        (acc: any, product: any) => {
          // Verificar se tem campo status ou ativo
          const isActive =
            product.status === "ACTIVE" ||
            product.status === "active" ||
            product.active === true ||
            product.active === 1 ||
            product.enabled === true ||
            product.enabled === 1;
          const status = isActive ? "ACTIVE" : "INACTIVE";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {},
      );

      const totalBaseProducts = productsData.data.length;
      const baseProductsActive = baseProductsByStatus["ACTIVE"] || 0;
      const baseProductsInactive = baseProductsByStatus["INACTIVE"] || 0;

      // === PROCESSAR DADOS DA LOJA ===

      // Status válidos para receitas (excluir pending e canceled)
      const validStatuses = ["paid", "factory", "shipped", "delivered"];
      const paidOrders = ordersData.data.filter((order: any) =>
        validStatuses.includes(order.currentStatus?.toLowerCase()),
      );

      // Métricas totais da loja (apenas pedidos pagos/concluídos)
      const totalShippingRevenue = paidOrders.reduce(
        (sum: number, order: any) => sum + (order.totalAmountShipping || 0),
        0,
      );

      const totalRevenue = paidOrders.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0,
      );

      // Calcular comissões da tabela commission-streamer
      const totalCommissionsPaid = commissionsData.data.reduce(
        (sum: number, commission: any) =>
          sum + (commission.commissionValue || 0),
        0,
      );

      // Calcular quantidade total de produtos vendidos
      const totalProductsSold = commissionsData.data.reduce(
        (sum: number, commission: any) =>
          sum + (commission.productSaleQuantity || 0),
        0,
      );

      const totalPixRevenue = paidOrders
        .filter((order: any) => order.paymentType === "PIX")
        .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      const totalCreditCardRevenue = paidOrders
        .filter((order: any) => order.paymentType === "CREDIT_CARD")
        .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      const totalOrdersCount = paidOrders.length;
      const totalAverageTicket =
        totalOrdersCount > 0
          ? paidOrders.reduce(
              (sum: number, order: any) => sum + (order.totalAmount || 0),
              0,
            ) / totalOrdersCount
          : 0;

      // Métricas dos últimos 30 dias da loja (apenas status válidos)
      const ordersLast30Days = paidOrders.filter(
        (order: any) => new Date(order.createdAt) > now30DaysAgo,
      );

      const totalRevenue30d = ordersLast30Days.reduce(
        (sum: number, order: any) => sum + (order.totalAmount || 0),
        0,
      );

      const shippingRevenue30d = ordersLast30Days.reduce(
        (sum: number, order: any) => sum + (order.totalAmountShipping || 0),
        0,
      );

      // Calcular comissões dos últimos 30 dias da tabela commission-streamer
      const commissions30d = commissionsData.data.filter(
        (commission: any) => new Date(commission.createdAt) > now30DaysAgo,
      );

      const commissionsPaid30d = commissions30d.reduce(
        (sum: number, commission: any) =>
          sum + (commission.commissionValue || 0),
        0,
      );

      // Calcular produtos vendidos nos últimos 30 dias
      const productsSold30d = commissions30d.reduce(
        (sum: number, commission: any) =>
          sum + (commission.productSaleQuantity || 0),
        0,
      );

      const pixRevenue30d = ordersLast30Days
        .filter((order: any) => order.paymentType === "PIX")
        .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      const creditCardRevenue30d = ordersLast30Days
        .filter((order: any) => order.paymentType === "CREDIT_CARD")
        .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

      const orders30dCount = ordersLast30Days.length;
      const averageTicket30d =
        orders30dCount > 0
          ? ordersLast30Days.reduce(
              (sum: number, order: any) => sum + (order.totalAmount || 0),
              0,
            ) / orders30dCount
          : 0;

      // === PROCESSAR DADOS DE DOAÇÕES ===

      // Doações totais
      const allDonationsAmount = donationsData.data.reduce(
        (sum: number, donation: any) => sum + (donation.amount || 0),
        0,
      );
      const allDonationsCount = donationsData.data.length;
      const allDonationsAverage =
        allDonationsCount > 0 ? allDonationsAmount / allDonationsCount : 0;
      const allDonationsHighest = Math.max(
        ...donationsData.data.map((d: any) => d.amount || 0),
        0,
      );

      // Doações dos últimos 30 dias
      const donationsLast30Days = donationsData.data.filter(
        (donation: any) => new Date(donation.createdAt) > now30DaysAgo,
      );

      const donations30dAmount = donationsLast30Days.reduce(
        (sum: number, donation: any) => sum + (donation.amount || 0),
        0,
      );
      const donations30dCount = donationsLast30Days.length;
      const donations30dAverage =
        donations30dCount > 0 ? donations30dAmount / donations30dCount : 0;
      const donations30dHighest = Math.max(
        ...donationsLast30Days.map((d: any) => d.amount || 0),
        0,
      );

      // Top streamers por doações (30 dias)
      const streamerDonations30d = donationsLast30Days.reduce(
        (acc: any, donation: any) => {
          const streamerId = donation.streamerId;
          if (!acc[streamerId]) {
            acc[streamerId] = { streamerId, totalAmount: 0 };
          }
          acc[streamerId].totalAmount += donation.amount || 0;
          return acc;
        },
        {},
      );

      const topStreamers30d = Object.values(streamerDonations30d)
        .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
        .slice(0, 10)
        .map((streamer: any) => {
          const streamerData = streamersData.data.find(
            (s: any) => s.id === streamer.streamerId,
          );
          return {
            name: streamerData?.name || "Nome não encontrado",
            amount: streamer.totalAmount,
          };
        });

      // Top streamers por doações (total)
      const streamerDonationsTotal = donationsData.data.reduce(
        (acc: any, donation: any) => {
          const streamerId = donation.streamerId;
          if (!acc[streamerId]) {
            acc[streamerId] = { streamerId, totalAmount: 0 };
          }
          acc[streamerId].totalAmount += donation.amount || 0;
          return acc;
        },
        {},
      );

      const topStreamersTotal = Object.values(streamerDonationsTotal)
        .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
        .slice(0, 10)
        .map((streamer: any) => {
          const streamerData = streamersData.data.find(
            (s: any) => s.id === streamer.streamerId,
          );
          return {
            name: streamerData?.name || "Nome não encontrado",
            amount: streamer.totalAmount,
          };
        });

      // Processar dados operacionais
      const ordersByStatus = ordersData.data.reduce((acc: any, order: any) => {
        const status = order.currentStatus || "UNKNOWN";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calcular status dos pedidos dos últimos 30 dias
      const orders30DaysAll = ordersData.data.filter(
        (order: any) => new Date(order.createdAt) > now30DaysAgo,
      );

      const ordersByStatus30d = orders30DaysAll.reduce(
        (acc: any, order: any) => {
          const status = order.currentStatus || "UNKNOWN";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {},
      );

      // Calculate top products usage from product-streamer relationships
      const calculateTopProductsUsage = (productStreamerData: any[]) => {
        const productUsage = new Map<
          number,
          {
            productId: number;
            productName: string;
            usageCount: number;
          }
        >();

        // Count usage of each base product
        productStreamerData.forEach((ps: any) => {
          if (ps.product && ps.product.id && ps.product.name) {
            const productId = ps.product.id;
            const productName = ps.product.name;

            if (productUsage.has(productId)) {
              const existing = productUsage.get(productId)!;
              existing.usageCount++;
            } else {
              productUsage.set(productId, {
                productId,
                productName,
                usageCount: 1,
              });
            }
          }
        });

        // Sort by usage count and get top 10
        const sortedProducts = Array.from(productUsage.values())
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, 10);

        // Calculate percentages
        const totalUsages = sortedProducts.reduce(
          (sum, product) => sum + product.usageCount,
          0,
        );

        return sortedProducts.map((product) => ({
          ...product,
          percentage:
            totalUsages > 0 ? (product.usageCount / totalUsages) * 100 : 0,
        }));
      };

      // Calculate top products sold from commission-streamer data
      const calculateTopProductsSold = (commissionsData: any[]) => {
        const productSales = new Map<
          string,
          {
            productId: string;
            productName: string;
            saleQuantity: number;
          }
        >();

        // Sum sales quantity for each product
        commissionsData.forEach((commission: any) => {
          if (commission.productStreamer && commission.productSaleQuantity) {
            // Handle both string and object cases for productStreamer
            let productName = "";
            if (typeof commission.productStreamer === "string") {
              productName = commission.productStreamer;
            } else if (
              commission.productStreamer &&
              typeof commission.productStreamer === "object"
            ) {
              // If it's an object, try to get name or id
              productName =
                commission.productStreamer.name ||
                commission.productStreamer.id ||
                "Produto Desconhecido";
            } else {
              return; // Skip if we can't get a valid product name
            }

            const saleQuantity = Number(commission.productSaleQuantity) || 0;

            if (productSales.has(productName)) {
              const existing = productSales.get(productName)!;
              existing.saleQuantity += saleQuantity;
            } else {
              productSales.set(productName, {
                productId: productName, // Using productName as ID since it's unique
                productName,
                saleQuantity,
              });
            }
          }
        });

        // Sort by sale quantity and get top 10
        const sortedProducts = Array.from(productSales.values())
          .sort((a, b) => b.saleQuantity - a.saleQuantity)
          .slice(0, 10);

        // Calculate percentages
        const totalSales = sortedProducts.reduce(
          (sum, product) => sum + product.saleQuantity,
          0,
        );

        return sortedProducts.map((product) => ({
          ...product,
          percentage:
            totalSales > 0 ? (product.saleQuantity / totalSales) * 100 : 0,
        }));
      };

      // Função para calcular top criadores por quantidade de produtos ATIVOS
      const calculateTopCreators = (data: any[], streamersData: any) => {
        if (!data || data.length === 0) return [];

        // Criar mapa de streamers para busca rápida por ID
        const streamersMap = new Map();
        if (streamersData && streamersData.data) {
          streamersData.data.forEach((streamer: any) => {
            streamersMap.set(streamer.id, streamer);
          });
        }

        // Filtrar apenas produtos com status ACTIVE
        const activeProducts = data.filter(
          (item: any) => item.status === "ACTIVE" || item.status === "active",
        );

        const streamerProductCount = new Map<
          string,
          { streamerId: string; streamerName: string; productCount: number }
        >();

        activeProducts.forEach((item: any) => {
          const streamerId = item.streamerId || item.streamer_id;

          if (streamerId) {
            // Buscar dados completos do streamer
            const streamerData = streamersMap.get(streamerId);
            let streamerName = "Criador Desconhecido";

            if (streamerData) {
              // Priorizar atname, depois name
              streamerName =
                streamerData.atname || streamerData.name || streamerId;
            } else if (item.streamer) {
              // Fallback para dados do produto-streamer
              streamerName =
                item.streamer.atname || item.streamer.name || streamerId;
            }

            if (streamerProductCount.has(streamerId)) {
              streamerProductCount.get(streamerId)!.productCount++;
            } else {
              streamerProductCount.set(streamerId, {
                streamerId,
                streamerName,
                productCount: 1,
              });
            }
          }
        });

        // Sort by product count and get top 10
        const sortedStreamers = Array.from(streamerProductCount.values())
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 10);

        return sortedStreamers;
      };

      // Calculate for all data and last 30 days
      const topProductsUsageTotal = calculateTopProductsUsage(
        productStreamersData.data || [],
      );
      const topCreatorsTotal = calculateTopCreators(
        productStreamersData.data || [],
        streamersData,
      );

      // Calculate top products sold from commission data
      const topProductsSoldTotal = calculateTopProductsSold(
        commissionsData.data || [],
      );

      const topProductsUsageLast30Days = calculateTopProductsUsage(
        (productStreamersData.data || []).filter((ps: any) => {
          // Try multiple possible date field names
          const dateField =
            ps.created_at || ps.createdAt || ps.date || ps.createDate;
          if (!dateField) return false;

          try {
            const createdDate = new Date(dateField);
            const thirtyDaysAgo = new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            );
            return createdDate >= thirtyDaysAgo;
          } catch (error) {
            return false;
          }
        }),
      );

      const topCreatorsLast30Days = calculateTopCreators(
        (productStreamersData.data || []).filter((ps: any) => {
          const dateField =
            ps.created_at || ps.createdAt || ps.date || ps.createDate;
          if (!dateField) return false;

          try {
            const createdDate = new Date(dateField);
            const thirtyDaysAgo = new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            );
            return createdDate >= thirtyDaysAgo;
          } catch (error) {
            return false;
          }
        }),
        streamersData,
      );

      // Calculate top products sold for last 30 days using existing filtered data
      const topProductsSoldLast30Days = calculateTopProductsSold(
        commissions30d || [],
      );

      // Calculate top streamers by sales from commission-streamer data
      const calculateTopStreamersSales = (
        commissionsData: any[],
        streamersData: any,
      ) => {
        const streamerSales = new Map<
          string,
          {
            streamerId: string;
            streamerName: string;
            totalSales: number;
            totalRevenue: number;
          }
        >();

        // Create streamers map for faster lookup
        const streamersMap = new Map();
        if (streamersData && streamersData.data) {
          streamersData.data.forEach((streamer: any) => {
            streamersMap.set(streamer.id, streamer);
          });
        }

        // Sum sales and revenue for each streamer
        commissionsData.forEach((commission: any) => {
          if (
            commission.streamerId &&
            commission.productSaleQuantity &&
            commission.commissionValue
          ) {
            const streamerId = commission.streamerId;
            const saleQuantity = Number(commission.productSaleQuantity) || 0;
            const commissionValue = Number(commission.commissionValue) || 0;

            // Get streamer name from streamers data
            const streamerData = streamersMap.get(streamerId);
            let streamerName = "Criador Desconhecido";

            if (streamerData) {
              streamerName =
                streamerData.atname || streamerData.name || streamerId;
            }

            if (streamerSales.has(streamerId)) {
              const existing = streamerSales.get(streamerId)!;
              existing.totalSales += saleQuantity;
              existing.totalRevenue += commissionValue;
            } else {
              streamerSales.set(streamerId, {
                streamerId,
                streamerName,
                totalSales: saleQuantity,
                totalRevenue: commissionValue,
              });
            }
          }
        });

        // Sort by total sales and get top 10
        const sortedStreamers = Array.from(streamerSales.values())
          .sort((a, b) => b.totalSales - a.totalSales)
          .slice(0, 10);

        // Calculate percentages based on total sales
        const totalSalesSum = sortedStreamers.reduce(
          (sum, streamer) => sum + streamer.totalSales,
          0,
        );

        return sortedStreamers.map((streamer) => ({
          ...streamer,
          percentage:
            totalSalesSum > 0 ? (streamer.totalSales / totalSalesSum) * 100 : 0,
        }));
      };

      // Calculate top streamers sales for total and last 30 days
      const topStreamersSalesTotal = calculateTopStreamersSales(
        commissionsData.data || [],
        streamersData,
      );
      const topStreamersSalesLast30Days = calculateTopStreamersSales(
        commissions30d || [],
        streamersData,
      );

      // Calcular orders factory das últimas 24 horas
      const now24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const ordersFactory24h = ordersData.data.filter((order: any) => {
        const isFactory = order.currentStatus === "FACTORY";
        if (!isFactory) return false;

        try {
          const createdDate = new Date(order.createdAt);
          return createdDate >= now24HoursAgo;
        } catch {
          return false;
        }
      }).length;

      // === CALCULAR MÉTRICAS DE CARTEIRA ===

      // Separar carteiras por tipo (tentar todas as variações possíveis)
      const storeWallets = walletsData.data.filter((wallet: any) => {
        const type = wallet.type?.toLowerCase();
        return type === "market" || type === "store" || type === "loja";
      });

      const donationWallets = walletsData.data.filter((wallet: any) => {
        const type = wallet.type?.toLowerCase();
        return type === "donate" || type === "donation" || type === "doacao";
      });

      // Calcular saldos da loja (market)
      let storeBalanceReleased = 0;
      let storeBalancePending = 0;

      storeWallets.forEach((wallet: any) => {
        const balance = parseFloat(wallet.balance) || 0;
        const pendingBalance =
          parseFloat(wallet.pendingBalance || wallet.pending_balance) || 0;
        storeBalanceReleased += balance;
        storeBalancePending += pendingBalance;
      });

      // Calcular saldos de doações (donate)
      let donationBalanceReleased = 0;
      let donationBalancePending = 0;

      donationWallets.forEach((wallet: any) => {
        const balance = parseFloat(wallet.balance) || 0;
        const pendingBalance =
          parseFloat(wallet.pendingBalance || wallet.pending_balance) || 0;
        donationBalanceReleased += balance;
        donationBalancePending += pendingBalance;
      });

      // Se não encontrarmos wallets separadas por tipo, vamos mostrar todas como "indefinidas"
      if (
        storeWallets.length === 0 &&
        donationWallets.length === 0 &&
        walletsData.data.length > 0
      ) {
        walletsData.data.forEach((wallet: any) => {
          const balance = parseFloat(wallet.balance) || 0;
          const pendingBalance =
            parseFloat(wallet.pendingBalance || wallet.pending_balance) || 0;
          // Assumir metade para store e metade para donations como fallback
          storeBalanceReleased += balance / 2;
          storeBalancePending += pendingBalance / 2;
          donationBalanceReleased += balance / 2;
          donationBalancePending += pendingBalance / 2;
        });
      }

      // === CALCULAR MÉTRICAS DE SAQUES ===

      // Filtrar saques completados
      const completedWithdrawals = withdrawalsData.data.filter(
        (withdrawal: any) =>
          withdrawal.status === "COMPLETED" ||
          withdrawal.status === "completed",
      );

      // Filtrar saques pendentes
      const pendingWithdrawals = withdrawalsData.data.filter(
        (withdrawal: any) =>
          withdrawal.status === "PENDING" || withdrawal.status === "pending",
      );

      // Calcular totais para saques completados
      const completedTotals = completedWithdrawals.reduce(
        (acc: any, w: any) => ({
          totalAmount: acc.totalAmount + (parseFloat(w.amount) || 0),
          totalFee: acc.totalFee + (parseFloat(w.fee) || 0),
          finalAmount: acc.finalAmount + (parseFloat(w.finalAmount) || 0),
          count: acc.count + 1,
        }),
        { totalAmount: 0, totalFee: 0, finalAmount: 0, count: 0 },
      );

      // Calcular totais para saques pendentes
      const pendingTotals = pendingWithdrawals.reduce(
        (acc: any, w: any) => ({
          totalAmount: acc.totalAmount + (parseFloat(w.amount) || 0),
          totalFee: acc.totalFee + (parseFloat(w.fee) || 0),
          finalAmount: acc.finalAmount + (parseFloat(w.finalAmount) || 0),
          count: acc.count + 1,
        }),
        { totalAmount: 0, totalFee: 0, finalAmount: 0, count: 0 },
      );

      // Calcular para últimos 30 dias
      const now30DaysAgoWithdrawals = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      );

      const completed30Days = completedWithdrawals.filter((w: any) => {
        try {
          const createdDate = new Date(w.createdAt);
          return createdDate >= now30DaysAgoWithdrawals;
        } catch {
          return false;
        }
      });

      const pending30Days = pendingWithdrawals.filter((w: any) => {
        try {
          const createdDate = new Date(w.createdAt);
          return createdDate >= now30DaysAgoWithdrawals;
        } catch {
          return false;
        }
      });

      const completed30DaysTotals = completed30Days.reduce(
        (acc: any, w: any) => ({
          totalAmount: acc.totalAmount + (parseFloat(w.amount) || 0),
          totalFee: acc.totalFee + (parseFloat(w.fee) || 0),
          finalAmount: acc.finalAmount + (parseFloat(w.finalAmount) || 0),
          count: acc.count + 1,
        }),
        { totalAmount: 0, totalFee: 0, finalAmount: 0, count: 0 },
      );

      const pending30DaysTotals = pending30Days.reduce(
        (acc: any, w: any) => ({
          totalAmount: acc.totalAmount + (parseFloat(w.amount) || 0),
          totalFee: acc.totalFee + (parseFloat(w.fee) || 0),
          finalAmount: acc.finalAmount + (parseFloat(w.finalAmount) || 0),
          count: acc.count + 1,
        }),
        { totalAmount: 0, totalFee: 0, finalAmount: 0, count: 0 },
      );

      const dashboardMetrics: DashboardMetrics = {
        store: {
          total: {
            totalRevenue: totalRevenue,
            shippingRevenue: totalShippingRevenue,
            pixRevenue: totalPixRevenue,
            creditCardRevenue: totalCreditCardRevenue,
            averageTicket: totalAverageTicket,
            totalOrders: totalOrdersCount,
            activeProducts: productsData.total || productsData.data.length,
            commissionsPaid: totalCommissionsPaid,
            productsSold: totalProductsSold,
            totalProductsCreated: totalProductsCreated,
            productsApproved: productsApproved,
            productsRejected: productsRejected,
            productsPending: productsPending,
            productsInactive: productsInactive,
            ordersPending: ordersByStatus["PENDING"] || 0,
            ordersPaid: ordersByStatus["PAID"] || 0,
            ordersFactory: ordersByStatus["FACTORY"] || 0,
            ordersShipped: ordersByStatus["SHIPPED"] || 0,
            ordersDelivered: ordersByStatus["DELIVERED"] || 0,
            ordersCanceled: ordersByStatus["CANCELED"] || 0,
            topProductsSold: topProductsSoldTotal,
            topStreamersSales: topStreamersSalesTotal,
          },
          last30Days: {
            totalRevenue: totalRevenue30d,
            shippingRevenue: shippingRevenue30d,
            pixRevenue: pixRevenue30d,
            creditCardRevenue: creditCardRevenue30d,
            averageTicket: averageTicket30d,
            totalOrders: orders30dCount,
            activeProducts: productsData.total || productsData.data.length,
            commissionsPaid: commissionsPaid30d,
            productsSold: productsSold30d,
            totalProductsCreated: totalProductsCreated,
            productsApproved: productsApproved,
            productsRejected: productsRejected,
            productsPending: productsPending,
            productsInactive: productsInactive,
            ordersPending: ordersByStatus30d["PENDING"] || 0,
            ordersPaid: ordersByStatus30d["PAID"] || 0,
            ordersFactory: ordersByStatus30d["FACTORY"] || 0,
            ordersShipped: ordersByStatus30d["SHIPPED"] || 0,
            ordersDelivered: ordersByStatus30d["DELIVERED"] || 0,
            ordersCanceled: ordersByStatus30d["CANCELED"] || 0,
            topProductsSold: topProductsSoldLast30Days,
            topStreamersSales: topStreamersSalesLast30Days,
          },
        },
        donations: {
          total: {
            totalDonations: allDonationsCount,
            totalAmount: allDonationsAmount,
            averageDonation: allDonationsAverage,
            highestDonation: allDonationsHighest,
            topStreamers: topStreamersTotal,
          },
          last30Days: {
            totalDonations: donations30dCount,
            totalAmount: donations30dAmount,
            averageDonation: donations30dAverage,
            highestDonation: donations30dHighest,
            topStreamers: topStreamers30d,
          },
        },
        users: {
          total: {
            totalUsers: usersData.total || usersData.data.length,
            totalStreamers: streamersData.total || streamersData.data.length,
            usersActive,
            usersInactive,
            usersBlocked,
            usersUnblocked,
            streamersWithProducts,
          },
          last30Days: {
            totalUsers: users30d.length,
            totalStreamers: streamersData.total || streamersData.data.length,
            usersActive: usersActive30d,
            usersInactive: usersInactive30d,
            usersBlocked: usersBlocked30d,
            usersUnblocked: usersUnblocked30d,
            newUsers: newUsers30d,
            streamersWithProducts,
          },
        },
        streamers: {
          total: {
            totalStreamers: streamersData.total || streamersData.data.length,
            streamersPublic,
            streamersPrivate,
            streamersWithProducts,
            requestsPending,
            requestsApproved,
            requestsRejected,
            topCreators: topCreatorsTotal,
          },
          last30Days: {
            totalStreamers: streamersData.total || streamersData.data.length,
            streamersPublic,
            streamersPrivate,
            streamersWithProducts,
            requestsPending: requestsPending30d,
            requestsApproved: requestsApproved30d,
            requestsRejected: requestsRejected30d,
            newStreamers: newStreamers30d,
            topCreators: topCreatorsLast30Days,
          },
        },
        baseProducts: {
          total: {
            totalBaseProducts: totalBaseProducts,
            baseProductsActive: baseProductsActive,
            baseProductsInactive: baseProductsInactive,
          },
          last30Days: {
            totalBaseProducts: totalBaseProducts, // Produtos base não mudam por período
            baseProductsActive: baseProductsActive,
            baseProductsInactive: baseProductsInactive,
          },
        },
        topProductsUsage: {
          total: {
            topProductsUsage: topProductsUsageTotal,
            topProductsSold: topProductsSoldTotal,
          },
          last30Days: {
            topProductsUsage: topProductsUsageLast30Days,
            topProductsSold: topProductsSoldLast30Days,
          },
        },
        pendingRequests: {
          withdrawalRequests: withdrawalRequestsPending,
          streamerRequests: streamerRequestsPending,
          productStreamerRequests: productStreamerPending,
          orderCancelRequests: orderCancelPending,
        },
        operational: {
          pendingOrders: ordersByStatus["PENDING"] || 0,
          processingOrders: ordersByStatus["PROCESSING"] || 0,
          shippedOrders: ordersByStatus["SHIPPED"] || 0,
          canceledOrders: ordersByStatus["CANCELED"] || 0,
          pendingWithdrawals: withdrawalsData.data.filter(
            (w: any) => w.status === "PENDING",
          ).length,
          ordersFactory24h: ordersFactory24h,
          missingData: {
            supportTickets: "Implementar endpoint: GET /api/v1/support-tickets",
          },
        },
        wallets: {
          total: {
            storeBalanceReleased: storeBalanceReleased,
            storeBalancePending: storeBalancePending,
            donationBalanceReleased: donationBalanceReleased,
            donationBalancePending: donationBalancePending,
          },
          last30Days: {
            // Para carteiras, os saldos são os mesmos (não mudam por período)
            storeBalanceReleased: storeBalanceReleased,
            storeBalancePending: storeBalancePending,
            donationBalanceReleased: donationBalanceReleased,
            donationBalancePending: donationBalancePending,
          },
        },
        withdrawals: {
          total: {
            completed: completedTotals,
            pending: pendingTotals,
          },
          last30Days: {
            completed: completed30DaysTotals,
            pending: pending30DaysTotals,
          },
        },
      };

      setMetrics(dashboardMetrics);
    } catch (err: any) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError(err.message || "Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dataProvider]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
