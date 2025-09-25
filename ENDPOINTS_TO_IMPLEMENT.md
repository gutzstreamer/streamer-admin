# 📋 ENDPOINTS QUE PRECISAM SER IMPLEMENTADOS NO BACKEND

Este arquivo lista todos os endpoints que precisam ser criados no backend para que o Dashboard tenha dados 100% reais.

## 🔍 **ANALYTICS E MÉTRICAS**

### 1. Taxa de Conversão
- **Endpoint:** `GET /api/v1/analytics/conversion-rate`
- **Descrição:** Retorna a taxa de conversão (visitantes que se tornaram compradores)
- **Estrutura sugerida:**
```json
{
  "conversionRate": 3.2,
  "period": "30d",
  "totalVisitors": 10000,
  "totalConverted": 320
}
```

### 2. Top Produtos por Vendas
- **Endpoint:** `GET /api/v1/analytics/top-products`
- **Parâmetros:** `?limit=10&period=30d`
- **Descrição:** Retorna os produtos mais vendidos
- **Estrutura sugerida:**
```json
{
  "data": [
    {
      "productId": "123",
      "name": "Camiseta Streamer ABC",
      "totalSales": 150,
      "revenue": 4500.00
    }
  ]
}
```

### 3. Top Streamers por Vendas
- **Endpoint:** `GET /api/v1/analytics/top-streamers-by-sales`
- **Parâmetros:** `?limit=10&period=30d`
- **Descrição:** Retorna os streamers que mais venderam
- **Estrutura sugerida:**
```json
{
  "data": [
    {
      "streamerId": "456",
      "name": "Streamer XYZ",
      "totalSales": 89,
      "totalRevenue": 2670.00,
      "commission": 267.00
    }
  ]
}
```

## 🎫 **SUPORTE AO CLIENTE**

### 4. Tickets de Suporte
- **Endpoint:** `GET /api/v1/support-tickets`
- **Parâmetros:** `?status=open&page=1&pageSize=25`
- **Descrição:** Retorna tickets de suporte
- **Estrutura sugerida:**
```json
{
  "data": [
    {
      "id": "789",
      "userId": "123",
      "subject": "Problema com pedido",
      "status": "open",
      "priority": "medium",
      "createdAt": "2025-09-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pageSize": 25
  }
}
```

### 5. Estatísticas de Suporte
- **Endpoint:** `GET /api/v1/support-tickets/stats`
- **Descrição:** Retorna estatísticas dos tickets
- **Estrutura sugerida:**
```json
{
  "totalOpen": 12,
  "totalClosed": 45,
  "averageResponseTime": "2h 30m",
  "satisfactionRate": 4.2
}
```

## 📊 **ANALYTICS AVANÇADOS (FUTURO)**

### 6. Métricas de Engajamento
- **Endpoint:** `GET /api/v1/analytics/engagement`
- **Descrição:** Páginas mais visitadas, tempo de sessão, etc.

### 7. Funil de Conversão
- **Endpoint:** `GET /api/v1/analytics/conversion-funnel`
- **Descrição:** Etapas do funil de vendas

### 8. Relatórios Temporais
- **Endpoint:** `GET /api/v1/analytics/timeline`
- **Descrição:** Dados históricos para gráficos temporais

## ⚡ **IMPLEMENTAÇÃO PRIORITÁRIA**

**Ordem de prioridade sugerida:**
1. `support-tickets` - Para alertas operacionais
2. `analytics/top-products` - Para insights de vendas
3. `analytics/top-streamers-by-sales` - Para gamificação
4. `analytics/conversion-rate` - Para otimização

## 🔧 **COMO TESTAR**

Após implementar os endpoints, você pode testar através:

1. **Browser:** Acesse http://localhost:5173/
2. **Console:** Abra F12 e veja se há erros de API
3. **Network:** Monitore as chamadas para os novos endpoints
4. **Dashboard:** Verifique se os dados aparecem corretamente

## 📝 **NOTAS TÉCNICAS**

- Todos os endpoints devem seguir o padrão REST já usado na aplicação
- Autenticação via Bearer token (já implementado)
- Paginação opcional mas recomendada para listas grandes
- Filtros por período (7d, 30d, 90d) são importantes para performance
- Considere implementar cache para dados que não mudam frequentemente

---

**Status atual:** ✅ Dashboard funcional com dados reais disponíveis + ⚠️ Alertas para dados faltantes