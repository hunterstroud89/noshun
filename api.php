<?php
/**
 * API Router — Single entry point for all backend operations
 * Routes: workspaces, pages, settings, images, sync
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];
$baseDir = __DIR__ . '/data/workspaces';

if (!is_dir($baseDir)) {
    mkdir($baseDir, 0755, true);
}

// Helper: get sanitized workspace id
function getWorkspaceId() {
    $wsId = isset($_GET['workspace']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['workspace']) : null;
    if (!$wsId) {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(['error' => 'Workspace ID required']);
        exit;
    }
    return $wsId;
}

// Helper: JSON input
function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

try {
    switch ($action) {

        // ========== WORKSPACES ==========
        case 'workspaces':
            header('Content-Type: application/json');
            if ($method === 'GET') {
                $workspaces = [];
                $dirs = glob("$baseDir/*", GLOB_ONLYDIR);
                foreach ($dirs as $dir) {
                    $settingsFile = "$dir/settings.json";
                    if (file_exists($settingsFile)) {
                        $settings = json_decode(file_get_contents($settingsFile), true);
                        if ($settings) {
                            $workspaces[] = [
                                'id' => basename($dir),
                                'name' => $settings['name'] ?? 'Untitled',
                                'icon' => $settings['icon'] ?? 'page'
                            ];
                        }
                    }
                }
                echo json_encode($workspaces);
            } elseif ($method === 'POST') {
                $input = getJsonInput();
                if (!$input || !isset($input['id'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Workspace ID required']);
                    exit;
                }
                $wsId = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['id']);
                $wsDir = "$baseDir/$wsId";
                if (!is_dir("$wsDir/pages")) mkdir("$wsDir/pages", 0755, true);
                if (!is_dir("$wsDir/images")) mkdir("$wsDir/images", 0755, true);

                $settings = [
                    'name' => $input['name'] ?? 'My Workspace',
                    'icon' => $input['icon'] ?? 'page',
                    'createdAt' => $input['createdAt'] ?? time() * 1000,
                    'updatedAt' => time() * 1000
                ];
                file_put_contents("$wsDir/settings.json", json_encode($settings, JSON_PRETTY_PRINT));
                echo json_encode(['id' => $wsId, 'name' => $settings['name'], 'icon' => $settings['icon']]);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        // ========== PAGES ==========
        case 'pages':
            header('Content-Type: application/json');
            $wsId = getWorkspaceId();
            $dataDir = "$baseDir/$wsId/pages";
            if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
            $pageId = isset($_GET['id']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['id']) : null;

            switch ($method) {
                case 'GET':
                    if ($pageId) {
                        $file = "$dataDir/$pageId.json";
                        if (file_exists($file)) {
                            echo file_get_contents($file);
                        } else {
                            http_response_code(404);
                            echo json_encode(['error' => 'Page not found']);
                        }
                    } else {
                        $pages = [];
                        $files = glob("$dataDir/*.json");
                        foreach ($files as $file) {
                            $content = file_get_contents($file);
                            $page = json_decode($content, true);
                            if ($page) $pages[] = $page;
                        }
                        usort($pages, function($a, $b) {
                            return ($b['updatedAt'] ?? 0) - ($a['updatedAt'] ?? 0);
                        });
                        echo json_encode($pages);
                    }
                    break;

                case 'POST':
                    $input = getJsonInput();
                    if (!$input || !isset($input['id'])) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid page data']);
                        exit;
                    }
                    $pageId = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['id']);
                    $file = "$dataDir/$pageId.json";
                    $input['createdAt'] = $input['createdAt'] ?? time() * 1000;
                    $input['updatedAt'] = time() * 1000;
                    file_put_contents($file, json_encode($input, JSON_PRETTY_PRINT));
                    echo json_encode($input);
                    break;

                case 'PUT':
                    if (!$pageId) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Page ID required']);
                        exit;
                    }
                    $file = "$dataDir/$pageId.json";
                    if (!file_exists($file)) {
                        http_response_code(404);
                        echo json_encode(['error' => 'Page not found']);
                        exit;
                    }
                    $input = getJsonInput();
                    if (!$input) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Invalid page data']);
                        exit;
                    }
                    $existing = json_decode(file_get_contents($file), true);
                    $merged = array_merge($existing, $input);
                    $merged['updatedAt'] = time() * 1000;
                    file_put_contents($file, json_encode($merged, JSON_PRETTY_PRINT));
                    echo json_encode($merged);
                    break;

                case 'DELETE':
                    if (!$pageId) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Page ID required']);
                        exit;
                    }
                    $file = "$dataDir/$pageId.json";
                    if (!file_exists($file)) {
                        http_response_code(404);
                        echo json_encode(['error' => 'Page not found']);
                        exit;
                    }
                    unlink($file);
                    echo json_encode(['success' => true]);
                    break;

                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        // ========== SETTINGS ==========
        case 'settings':
            header('Content-Type: application/json');
            $wsId = getWorkspaceId();
            $wsDir = "$baseDir/$wsId";
            $file = "$wsDir/settings.json";
            if (!is_dir($wsDir)) mkdir($wsDir, 0755, true);

            if ($method === 'GET') {
                if (file_exists($file)) {
                    echo file_get_contents($file);
                } else {
                    echo json_encode(new stdClass());
                }
            } elseif ($method === 'POST') {
                $input = getJsonInput();
                if ($input === null) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON']);
                    exit;
                }
                $existing = [];
                if (file_exists($file)) {
                    $existing = json_decode(file_get_contents($file), true) ?: [];
                }
                $merged = array_merge($existing, $input);
                $merged['updatedAt'] = time() * 1000;
                file_put_contents($file, json_encode($merged, JSON_PRETTY_PRINT));
                echo json_encode($merged);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        // ========== IMAGES ==========
        case 'images':
            $wsId = getWorkspaceId();
            $imagesDir = "$baseDir/$wsId/images";
            if (!is_dir($imagesDir)) mkdir($imagesDir, 0755, true);

            if ($method === 'POST') {
                header('Content-Type: application/json');
                if (!isset($_FILES['image'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'No image file provided']);
                    exit;
                }
                $file = $_FILES['image'];
                if ($file['error'] !== UPLOAD_ERR_OK) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Upload failed']);
                    exit;
                }
                $maxSize = 5 * 1024 * 1024;
                if ($file['size'] > $maxSize) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Image must be under 5MB']);
                    exit;
                }
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mimeType = $finfo->file($file['tmp_name']);
                if (!in_array($mimeType, $allowedTypes)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid image type']);
                    exit;
                }
                $ext = match ($mimeType) {
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                    'image/svg+xml' => 'svg',
                    default => 'png'
                };
                $filename = uniqid('img_', true) . '.' . $ext;
                $destPath = "$imagesDir/$filename";
                if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to save image']);
                    exit;
                }
                $url = "data/workspaces/$wsId/images/$filename";
                echo json_encode(['url' => $url, 'filename' => $filename]);

            } elseif ($method === 'DELETE') {
                header('Content-Type: application/json');
                $filename = isset($_GET['file']) ? basename($_GET['file']) : null;
                if (!$filename) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Filename required']);
                    exit;
                }
                $filePath = "$imagesDir/$filename";
                if (file_exists($filePath)) {
                    unlink($filePath);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Image not found']);
                }
            } else {
                header('Content-Type: application/json');
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        // ========== SYNC ==========
        case 'sync':
            header('Content-Type: application/json');
            $wsId = getWorkspaceId();
            $dataDir = "$baseDir/$wsId/pages";
            if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

            if ($method === 'GET') {
                $pages = [];
                $files = glob("$dataDir/*.json");
                foreach ($files as $file) {
                    $content = file_get_contents($file);
                    $page = json_decode($content, true);
                    if ($page) $pages[$page['id']] = $page;
                }
                echo json_encode(['pages' => $pages, 'syncedAt' => time() * 1000]);

            } elseif ($method === 'POST') {
                $input = getJsonInput();
                if (!$input || !isset($input['pages'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid sync data']);
                    exit;
                }
                $clientPages = $input['pages'];
                $serverPages = [];
                $conflicts = [];
                $files = glob("$dataDir/*.json");
                foreach ($files as $file) {
                    $content = file_get_contents($file);
                    $page = json_decode($content, true);
                    if ($page) $serverPages[$page['id']] = $page;
                }
                foreach ($clientPages as $id => $clientPage) {
                    $pageId = preg_replace('/[^a-zA-Z0-9_-]/', '', $id);
                    $file = "$dataDir/$pageId.json";
                    if (isset($serverPages[$id])) {
                        $serverPage = $serverPages[$id];
                        $clientUpdated = $clientPage['updatedAt'] ?? 0;
                        $serverUpdated = $serverPage['updatedAt'] ?? 0;
                        if ($clientUpdated > $serverUpdated) {
                            file_put_contents($file, json_encode($clientPage, JSON_PRETTY_PRINT));
                            $serverPages[$id] = $clientPage;
                        } elseif ($serverUpdated > $clientUpdated) {
                            $conflicts[] = $id;
                        }
                    } else {
                        file_put_contents($file, json_encode($clientPage, JSON_PRETTY_PRINT));
                        $serverPages[$id] = $clientPage;
                    }
                }
                echo json_encode(['pages' => $serverPages, 'conflicts' => $conflicts, 'syncedAt' => time() * 1000]);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        default:
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode(['error' => 'Unknown action: ' . $action]);
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
