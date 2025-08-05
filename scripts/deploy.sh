#!/bin/bash

# AMIGO 幫助中心 - GitHub Pages 部署腳本
# 用途：自動部署到 GitHub Pages
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

# 檢查 Git 狀態
check_git_status() {
    log_info "檢查 Git 狀態..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "當前目錄不是 Git 倉庫"
        exit 1
    fi
    
    # 檢查是否有未提交的更改
    if ! git diff-index --quiet HEAD --; then
        log_warning "發現未提交的更改"
        log_info "未提交的文件:"
        git status --porcelain
        echo ""
        read -p "是否繼續部署? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
    
    log_success "Git 狀態檢查通過"
}

# 檢查分支
check_branch() {
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "當前分支: $CURRENT_BRANCH"
    
    if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
        log_warning "當前不在主分支 (main/master)"
        read -p "是否繼續部署? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
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

# 構建項目
build_for_deployment() {
    log_info "構建項目用於部署..."
    
    # 運行構建腳本
    if ./scripts/build.sh; then
        log_success "項目構建完成"
    else
        log_error "項目構建失敗"
        exit 1
    fi
}

# 部署到 GitHub Pages
deploy_to_github_pages() {
    log_info "部署到 GitHub Pages..."
    
    # 檢查 out 目錄
    if [ ! -d "out" ]; then
        log_error "未找到 out 目錄，請先運行構建"
        exit 1
    fi
    
    # 記錄部署時間
    DEPLOY_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$DEPLOY_TIME - 開始部署到 GitHub Pages" >> logs/deploy.log
    
    # 檢查是否存在 gh-pages 分支
    if git show-ref --verify --quiet refs/heads/gh-pages; then
        log_info "切換到 gh-pages 分支..."
        git checkout gh-pages
    else
        log_info "創建 gh-pages 分支..."
        git checkout --orphan gh-pages
    fi
    
    # 清理舊文件 (保留 .git 目錄)
    log_info "清理舊的部署文件..."
    find . -maxdepth 1 ! -name '.git' ! -name 'out' ! -name '.' -exec rm -rf {} + 2>/dev/null || true
    
    # 複製新文件
    log_info "複製新的靜態文件..."
    cp -r out/* .
    
    # 添加 CNAME 文件 (如果需要自定義域名)
    # echo "your-domain.com" > CNAME
    
    # 提交更改
    log_info "提交部署文件..."
    git add .
    
    if git diff --staged --quiet; then
        log_warning "沒有檢測到更改，跳過提交"
    else
        git commit -m "Deploy to GitHub Pages - $DEPLOY_TIME"
        
        # 推送到遠程倉庫
        log_info "推送到 GitHub..."
        if git push origin gh-pages --force; then
            log_success "成功推送到 GitHub Pages"
        else
            log_error "推送失敗"
            exit 1
        fi
    fi
    
    # 切換回原分支
    git checkout -
    
    # 清理 out 目錄
    rm -rf out
    
    echo "$DEPLOY_TIME - 部署完成" >> logs/deploy.log
}

# 顯示部署結果
show_deploy_result() {
    echo ""
    log_success "=========================================="
    log_success "         部署完成！"
    log_success "=========================================="
    echo ""
    
    # 獲取倉庫信息
    REPO_URL=$(git config --get remote.origin.url)
    if [[ $REPO_URL == *"github.com"* ]]; then
        # 提取用戶名和倉庫名
        REPO_INFO=$(echo $REPO_URL | sed 's/.*github\.com[:/]\([^/]*\)\/\([^.]*\).*/\1\/\2/')
        PAGES_URL="https://${REPO_INFO%/*}.github.io/${REPO_INFO#*/}"
        
        log_info "GitHub Pages URL: $PAGES_URL"
        log_info "部署可能需要幾分鐘才能生效"
    fi
    
    echo ""
}

# 主函數
main() {
    echo ""
    log_info "=========================================="
    log_info "    AMIGO 幫助中心 - GitHub Pages 部署"
    log_info "=========================================="
    echo ""
    
    check_git_status
    check_branch
    create_log_directory
    build_for_deployment
    deploy_to_github_pages
    show_deploy_result
}

# 執行主函數
main "$@"
