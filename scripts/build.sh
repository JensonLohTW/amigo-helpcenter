#!/bin/bash

# AMIGO 幫助中心 - 生產環境構建腳本
# 用途：構建生產版本，支援 GitHub Pages 部署
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

# 檢查 Node.js 版本
check_node_version() {
    log_info "檢查 Node.js 版本..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安裝，請先安裝 Node.js 18+ 版本"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 版本過低 (當前: $(node -v))，請升級到 18+ 版本"
        exit 1
    fi
    
    log_success "Node.js 版本檢查通過 ($(node -v))"
}

# 檢查依賴
check_dependencies() {
    log_info "檢查項目依賴..."
    
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules 目錄不存在，正在安裝依賴..."
        npm ci --production=false
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

# 清理舊的構建文件
cleanup_build() {
    log_info "清理舊的構建文件..."
    
    # 清理 .next 目錄
    if [ -d ".next" ]; then
        rm -rf .next
        log_success "已清理 .next 目錄"
    fi
    
    # 清理 out 目錄
    if [ -d "out" ]; then
        rm -rf out
        log_success "已清理 out 目錄"
    fi
}

# 運行 ESLint 檢查
run_lint() {
    log_info "運行代碼檢查..."
    
    if npm run lint; then
        log_success "代碼檢查通過"
    else
        log_error "代碼檢查失敗，請修復錯誤後重新構建"
        exit 1
    fi
}

# 構建項目
build_project() {
    log_info "開始構建 AMIGO 幫助中心..."
    
    # 記錄構建開始時間
    BUILD_START=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$BUILD_START - 開始構建" >> logs/build.log
    
    # 運行 Next.js 構建
    if npm run build 2>&1 | tee -a logs/build.log; then
        BUILD_END=$(date '+%Y-%m-%d %H:%M:%S')
        echo "$BUILD_END - 構建完成" >> logs/build.log
        log_success "項目構建完成"
    else
        log_error "項目構建失敗，請檢查錯誤信息"
        exit 1
    fi
}

# 生成靜態文件 (用於 GitHub Pages)
export_static() {
    log_info "生成靜態文件用於 GitHub Pages 部署..."
    
    if npm run export 2>&1 | tee -a logs/build.log; then
        log_success "靜態文件生成完成"
        
        # 檢查 out 目錄
        if [ -d "out" ]; then
            FILE_COUNT=$(find out -type f | wc -l)
            log_info "生成了 $FILE_COUNT 個靜態文件"
            
            # 創建 .nojekyll 文件 (GitHub Pages 需要)
            touch out/.nojekyll
            log_success "已創建 .nojekyll 文件"
        else
            log_error "靜態文件生成失敗，out 目錄不存在"
            exit 1
        fi
    else
        log_error "靜態文件生成失敗"
        exit 1
    fi
}

# 顯示構建結果
show_build_result() {
    echo ""
    log_success "=========================================="
    log_success "         構建完成！"
    log_success "=========================================="
    echo ""
    
    if [ -d "out" ]; then
        log_info "靜態文件位置: ./out/"
        log_info "可以直接部署到 GitHub Pages"
        echo ""
        log_info "本地預覽命令:"
        log_info "  cd out && python3 -m http.server 8000"
        log_info "  然後訪問 http://localhost:8000"
    fi
    
    echo ""
}

# 主函數
main() {
    echo ""
    log_info "=========================================="
    log_info "    AMIGO 幫助中心 - 生產環境構建"
    log_info "=========================================="
    echo ""
    
    check_node_version
    check_dependencies
    create_log_directory
    cleanup_build
    run_lint
    build_project
    export_static
    show_build_result
}

# 執行主函數
main "$@"
