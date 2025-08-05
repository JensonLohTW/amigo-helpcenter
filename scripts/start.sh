#!/bin/bash

# AMIGO 幫助中心 - 生產環境啟動腳本
# 用途：啟動生產版本服務器
# 作者：AMIGO 開發團隊
# 版本：v1.0.0

set -e  # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查構建文件
check_build() {
    log_info "檢查構建文件..."
    
    if [ ! -d ".next" ]; then
        log_error "未找到構建文件，請先運行 ./scripts/build.sh"
        exit 1
    fi
    
    log_success "構建文件檢查通過"
}

# 檢查依賴
check_dependencies() {
    log_info "檢查生產依賴..."
    
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules 目錄不存在，正在安裝生產依賴..."
        npm ci --production
    else
        log_success "依賴檢查通過"
    fi
}

# 創建日誌目錄
create_log_directory() {
    if [ ! -d "logs" ]; then
        log_info "創建日誌目錄..."
        mkdir -p logs
        log_success "日誌目錄創建完成"
    fi
}

# 清理舊的生產進程
cleanup_processes() {
    log_info "清理可能存在的舊進程..."
    
    # 查找並終止佔用 3000 端口的進程
    PID=$(lsof -ti:3000 2>/dev/null || true)
    if [ ! -z "$PID" ]; then
        log_warning "發現佔用 3000 端口的進程 (PID: $PID)，正在終止..."
        kill -9 $PID 2>/dev/null || true
        sleep 2
        log_success "舊進程已清理"
    fi
}

# 啟動生產服務器
start_production_server() {
    log_info "啟動 AMIGO 幫助中心生產服務器..."
    log_info "服務器將在 http://localhost:3000 啟動"
    log_info "按 Ctrl+C 停止服務器"
    echo ""
    
    # 記錄啟動時間
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 生產服務器啟動" >> logs/production.log
    
    # 啟動 Next.js 生產服務器
    npm run start 2>&1 | tee -a logs/production.log
}

# 主函數
main() {
    echo ""
    log_info "=========================================="
    log_info "    AMIGO 幫助中心 - 生產環境啟動"
    log_info "=========================================="
    echo ""
    
    check_build
    check_dependencies
    create_log_directory
    cleanup_processes
    start_production_server
}

# 捕獲中斷信號
trap 'log_warning "生產服務器已停止"; exit 0' INT TERM

# 執行主函數
main "$@"
