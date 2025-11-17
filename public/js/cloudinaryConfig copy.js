// Cloudinary Configuration and Helper Functions

const CLOUDINARY_CONFIG = {
    cloudName: 'dauizdtxq', // Tên cloud của bạn
    uploadPreset: 'too_upload_v2', // Upload preset của bạn
    // CHANGELOG: Đã xóa apiKey. 
    // Nó không cần thiết cho việc upload không-ký-tên (unsigned) khi dùng preset.
    // Giữ nó ở đây có thể gây nhầm lẫn với API Secret (vốn không bao giờ được đặt ở client).
  };
  
  class CloudinaryService {
    constructor(config) {
      this.cloudName = config.cloudName;
      this.uploadPreset = config.uploadPreset;
      this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;
    }
  
    /**
     * Upload a file to Cloudinary (Sử dụng XMLHttpRequest để hỗ trợ theo dõi tiến độ)
     * @param {File} file - The file to upload
     * @param {Object} options - Upload options
     * @param {string} options.folder - Folder path in Cloudinary
     * @param {string} options.publicId - Custom public ID for the file
     * @param {Function} options.onProgress - Progress callback
     * @returns {Promise<Object>} Upload result with URL and public_id
     */
    async uploadFile(file, options = {}) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
  //     formData.append('eager_async', 'true');
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }
  
      const resourceType = this.getResourceType(file);
      const uploadUrl = `${this.baseUrl}/${resourceType}/upload`;
  
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        if (options.onProgress) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              options.onProgress({
                bytesTransferred: e.loaded,
                totalBytes: e.total,
                percent: percentComplete
              });
            }
          });
        }
  
        xhr.addEventListener('load', () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve({
                url: response.secure_url,
                publicId: response.public_id,
                resourceType: response.resource_type,
                format: response.format,
                width: response.width,
                height: response.height,
                bytes: response.bytes
              });
            } else {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error.message || `Upload failed with status ${xhr.status}`));
            }
          } catch (e) {
            reject(new Error(`Upload failed: ${e.message}`));
          }
        });
  
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });
  
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });
    }
  
    /**
     * Delete a file from Cloudinary (Cần có server-side)
     * @param {string} publicId - The public ID of the file to delete
     * @param {string} resourceType - The resource type (image, video, raw)
     * @returns {Promise<Object>} Deletion result
     */
    async deleteFile(publicId, resourceType = 'image') {
      // CẢNH BÁO BẢO MẬT: Xóa file yêu cầu API Secret.
      // Việc này *phải* được thực hiện trên server (backend) của bạn.
      // Hàm này chỉ là một giả lập phía client.
      console.warn('File deletion should be handled server-side for security. Public ID:', publicId);
      
      // Trong thực tế, bạn sẽ gọi API backend của mình tại đây.
      // Ví dụ: await fetch('/api/delete-media', { method: 'POST', body: JSON.stringify({ publicId, resourceType }) });
      return Promise.resolve({ result: 'ok', publicId });
    }
  
    /**
     * Lấy URL file với các transformation tùy chỉnh.
     * CHANGELOG: Đã sửa lại hàm này.
     * Thay vì một object bị giới hạn, nó nhận một CHUỖI transformation.
     * Cách dùng: getDownloadURL('id_file', 'c_scale,w_300/f_auto,q_auto')
     *
     * @param {string} publicId - The public ID of the file
     * @param {string} [transformString=''] - Chuỗi transformation (ví dụ: 'c_fill,w_150,h_150/g_auto')
     * @param {string} [resourceType=null] - Loại tài nguyên (image, video, raw) - sẽ tự động phát hiện
     * @returns {string} The URL of the file
     */
    getDownloadURL(publicId, transformString = '', resourceType = null) {
      if (!publicId) {
        throw new Error('Public ID is required');
      }
  
      if (publicId.startsWith('http')) {
        return publicId;
      }
  
      if (!resourceType) {
        resourceType = this.getResourceTypeFromPath(publicId);
      }
  
      // Đảm bảo chuỗi transformation có dấu gạch chéo / ở đầu nếu nó không rỗng
      const finalTransformString = transformString ? `/${transformString}` : '';
  
      return `https://res.cloudinary.com/${this.cloudName}/${resourceType}/upload${finalTransformString}/${publicId}`;
    }
  
    /**
     * Get resource type from file path/extension
     * @param {string} filePath - File path or name
     * @returns {string} Resource type
     */
    getResourceTypeFromPath(filePath) {
      const extMatch = filePath.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'heic', 'avif'];
      const videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm3u8', 'ts'];
      const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];
      
      if (imageExts.includes(ext)) return 'image';
      if (videoExts.includes(ext)) return 'video';
      if (audioExts.includes(ext)) return 'video'; // Cloudinary dùng 'video' cho audio
      return 'raw';
    }
  
    /**
     * Get resource type based on file MIME type
     * @param {File} file - The file
     * @returns {string} Resource type (image, video, raw)
     */
    getResourceType(file) {
      const type = file.type ? file.type.toLowerCase() : '';
      if (type.startsWith('image/')) {
        return 'image';
      } else if (type.startsWith('video/')) {
        return 'video';
      } else if (type.startsWith('audio/')) {
        return 'video'; // Cloudinary dùng 'video' cho audio
      } else {
        return 'raw';
      }
    }
  
    /**
     * Trích xuất public ID từ một Cloudinary URL.
     * CHANGELOG: Đã thay thế logic cũ bằng một biểu thức chính quy (regex) mạnh mẽ hơn.
     * Nó sẽ trích xuất chính xác public ID ngay cả khi có transformation và version.
     * @param {string} url - Cloudinary URL
     * @returns {string} Public ID (ví dụ: 'folder/my_image')
     */
    extractPublicId(url) {
      if (!url || !url.includes('cloudinary.com')) {
        return url;
      }
  
      try {
        // Regex này tìm phần /upload/, bỏ qua các transformations (ví dụ: c_fill,w_100/)
        // và version (ví dụ: v12345678/), sau đó lấy mọi thứ cho đến dấu chấm cuối cùng.
        const regex = /\/upload\/(?:[a-zA-Z0-9_\-,\.]+\/)*?(?:v\d+\/)?([^\.]+)/;
        const match = url.match(regex);
        
        if (match && match[1]) {
          return match[1]; // Trả về 'folder/my_image'
        }
        
        // Fallback cho các URL không có extension
        const simpleRegex = /\/upload\/(?:[a-zA-Z0-9_\-,\.]+\/)*?(?:v\d+\/)?(.*)/;
        const simpleMatch = url.match(simpleRegex);
        if (simpleMatch && simpleMatch[1]) {
          return simpleMatch[1];
        }
  
        return url; // Không thể trích xuất, trả về URL gốc
      } catch (error) {
        console.error('Error extracting public ID:', error);
        return url;
      }
    }
  
    /**
     * Tạo một đối tượng tham chiếu (ref) mô phỏng Firebase Storage
     * @param {string} path - Đường dẫn/public ID (ví dụ: 'users/uid/profile.jpg')
     * @returns {Object} Reference object
     */
    ref(path) {
      const self = this;
      
      return {
        path: path,
        
        /**
         * Upload a file to this reference
         * @param {File} file - The file to upload
         * @param {Object} [metadata={}] - Metadata (bao gồm onProgress)
         * @returns {UploadTask} Một đối tượng giống UploadTask của Firebase
         */
        put(file, metadata = {}) {
          // Tách folder và tên file từ path
          const lastSlash = path.lastIndexOf('/');
          const folder = (lastSlash > -1) ? path.substring(0, lastSlash) : '';
          let fileName = (lastSlash > -1) ? path.substring(lastSlash + 1) : path;
          
          // Xóa phần extension file khỏi publicId, vì Cloudinary tự quản lý
          const lastDot = fileName.lastIndexOf('.');
          const publicId = (lastDot > -1) ? fileName.substring(0, lastDot) : fileName;
          
          let uploadPromise = null;
          const onProgressCallback = metadata.onProgress || (() => {});
          
          // Lưu reference object để dùng trong snapshot
          const refObject = {
            path: path,
            getDownloadURL: () => Promise.resolve(null) // Sẽ được cập nhật sau khi upload
          };
          
          const getUploadPromise = () => {
            if (uploadPromise) {
              return uploadPromise;
            }
            
            uploadPromise = self.uploadFile(file, {
              folder: folder,
              publicId: publicId,
              onProgress: (progress) => {
                // Gọi callback được cung cấp qua metadata
                onProgressCallback(progress);
                // Gọi callback nếu dùng .on('state_changed')
                if (uploadTask._progressCallback) {
                  uploadTask._progressCallback(progress);
                }
              },
            });
            
            return uploadPromise;
          };
          
          const uploadTask = {
            snapshot: null,
            _progressCallback: null,
            _errorCallback: null,
            _completeCallback: null,
            
            on(event, onProgress, onError, onComplete) {
              if (event === 'state_changed') {
                uploadTask._progressCallback = onProgress;
                uploadTask._errorCallback = onError;
                uploadTask._completeCallback = onComplete;
                
                // Bắt đầu upload
                getUploadPromise()
                  .then(result => {
                    // Cập nhật refObject với URL thực
                    refObject.getDownloadURL = () => Promise.resolve(result.url);
                    
                    uploadTask.snapshot = {
                      ref: refObject,
                      bytesTransferred: result.bytes,
                      totalBytes: result.bytes,
                      state: 'success',
                      metadata: { contentType: file.type, size: result.bytes },
                      // Cung cấp hàm getDownloadURL bên trong snapshot
                      getDownloadURL: () => Promise.resolve(result.url)
                    };
                    
                    if (onComplete) onComplete(uploadTask.snapshot);
                  })
                  .catch(error => {
                    if (onError) onError(error);
                  });
              }
              
              return () => { /* Hàm unsubscribe, có thể bỏ qua cho đơn giản */ };
            },
            
            // Hỗ trợ async/await (Promise-like)
            then(onFulfilled, onRejected) {
              return getUploadPromise()
                .then(result => {
                  // Cập nhật refObject với URL thực
                  refObject.getDownloadURL = () => Promise.resolve(result.url);
                  
                  uploadTask.snapshot = {
                    ref: refObject,
                    bytesTransferred: result.bytes,
                    totalBytes: result.bytes,
                    state: 'success',
                    metadata: { contentType: file.type, size: result.bytes },
                    getDownloadURL: () => Promise.resolve(result.url)
                  };
                  // Gọi onFulfilled với snapshot, giống Firebase
                  if (onFulfilled) onFulfilled(uploadTask.snapshot);
                    return uploadTask.snapshot; 
                })
                .catch(error => {
                  if (onRejected) onRejected(error);
                  throw error;
                });
            },
            
            catch(onRejected) {
              return this.then(null, onRejected);
            }
          };
          
          return uploadTask;
        },
        
        async delete() {
          // Lấy public ID sạch, không có extension
          const lastDot = path.lastIndexOf('.');
          const publicId = (lastDot > -1) ? path.substring(0, lastDot) : path;
          
          const resourceType = self.getResourceTypeFromPath(path);
          return await self.deleteFile(publicId, resourceType);
        },
        
        async getDownloadURL() {
          if (path.startsWith('http')) {
            return path;
          }
          
          const resourceType = self.getResourceTypeFromPath(path);
          
          // CHANGELOG: Đã sửa. Truyền một chuỗi rỗng '' thay vì object {}.
          // Điều này sẽ trả về URL gốc (đã được tối ưu bằng f_auto/q_auto nếu bạn cài Eager).
          // Nếu bạn muốn một transformation cụ thể tại đây, hãy truyền nó vào,
          // ví dụ: return self.getDownloadURL(path, 'c_thumb,w_100', resourceType);
          return self.getDownloadURL(path, '', resourceType);
        },
        
        /**
         * Cloudinary không hỗ trợ listAll() từ client-side.
         * Phương thức này trả về kết quả rỗng để tương thích với Firebase Storage API.
         * Sử dụng Realtime Database để lấy danh sách file thay thế.
         */
        async listAll() {
          console.warn('Cloudinary does not support listAll() from client-side. Use Realtime Database instead.');
          return {
            items: [],
            prefixes: []
          };
        },
        
        fullPath: path
      };
    }
  }
  
  // Khởi tạo Cloudinary service
  const cloudinaryService = new CloudinaryService(CLOUDINARY_CONFIG);
  
  // Thêm hàm test debug
  cloudinaryService.testConnection = async function() {
    console.log("=== CLOUDINARY DEBUG TEST ===");
    console.log("Cloud Name:", this.cloudName);
    console.log("Upload Preset:", this.uploadPreset);
    console.log("Base URL:", this.baseUrl);
    
    // Tạo một file test nhỏ (1x1 pixel PNG)
    const testBlob = new Blob([new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ])], { type: 'image/png' });
    
    const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
    
    console.log("Đang test upload với file test nhỏ...");
    
    try {
      const result = await this.uploadFile(testFile, {
        folder: 'test',
        publicId: 'connection_test_' + Date.now()
      });
      console.log("✅ Upload test THÀNH CÔNG!");
      console.log("URL:", result.url);
      console.log("Public ID:", result.publicId);
      return { success: true, result };
    } catch (error) {
      console.error("❌ Upload test THẤT BẠI!");
      console.error("Lỗi:", error);
      console.error("Message:", error.message);
      return { success: false, error: error.message };
    }
  };
  
  // Đặt cờ sẵn sàng
  window.cloudinaryReady = true;
  
  // Gửi sự kiện (event)
  window.dispatchEvent(new CustomEvent('cloudinaryReady'));
  
  // Xuất ra window để dùng global
  window.cloudinaryService = cloudinaryService;
  
  console.log("✅ Cloudinary service đã sẵn sàng!");
  console.log("Để test kết nối, chạy: window.cloudinaryService.testConnection()");