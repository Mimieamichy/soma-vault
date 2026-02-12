import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const document = {
  openapi: '3.0.0',
  info: {
    title: 'SomaVault API',
    version: '1.0.0',
    description: 'API documentation for Study Plan Management And Archiving System',
    contact: {
      name: 'API Support',
      email: 'support@studyplan.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and profile management'
    },
    {
      name: 'Study Plans',
      description: 'Study plan creation, management, and progress tracking'
    },
    {
      name: 'Materials',
      description: 'Study material upload, management, and organization'
    },
    {
      name: 'PQ Hub',
      description: 'AI-powered question answering based on uploaded materials'
    },
    {
      name: 'Notifications',
      description: 'User notification management'
    },
    {
      name: 'Payments',
      description: 'Payment processing and management'
    },
    {
      name: 'Subscriptions',
      description: 'User subscription information'
    },
    {
      name: 'Analytics',
      description: 'System analytics and reporting (Admin only)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token'
      }
    },
    schemas: {
      // Response schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            example: 'Error message'
          }
        }
      },
      // Auth schemas
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'student@university.edu'
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 6,
            example: 'SecurePass123!'
          },
          name: {
            type: 'string',
            example: 'John Doe'
          },
          school: {
            type: 'string',
            example: 'University of Technology'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'student@university.edu'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SecurePass123!'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              user: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'user123'
                  },
                  email: {
                    type: 'string',
                    example: 'student@university.edu'
                  },
                  name: {
                    type: 'string',
                    example: 'John Doe'
                  },
                  role: {
                    type: 'string',
                    enum: ['STUDENT', 'ADMIN'],
                    example: 'STUDENT'
                  }
                }
              }
            }
          }
        }
      },
      UserProfile: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'user123'
              },
              email: {
                type: 'string',
                example: 'student@university.edu'
              },
              name: {
                type: 'string',
                example: 'John Doe'
              },
              school: {
                type: 'string',
                example: 'University of Technology'
              },
              role: {
                type: 'string',
                example: 'STUDENT'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              }
            }
          }
        }
      },
      // Study Plan schemas
      CreateStudyPlanRequest: {
        type: 'object',
        required: ['materialId', 'title', 'totalDays', 'studyFrequency'],
        properties: {
          materialId: {
            type: 'string',
            example: 'material123'
          },
          title: {
            type: 'string',
            example: 'Calculus Final Exam Prep'
          },
          totalDays: {
            type: 'integer',
            minimum: 1,
            example: 30
          },
          studyFrequency: {
            type: 'string',
            enum: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'],
            example: 'DAILY'
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            example: '2024-02-01T00:00:00Z'
          }
        }
      },
      CreateStudyPlanWithFileRequest: {
        type: 'object',
        required: ['file', 'title', 'totalDays', 'studyFrequency'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File upload (PDF, DOC, DOCX, TXT, or images). Max size: 10MB'
          },
          title: {
            type: 'string',
            example: 'Physics Study Guide'
          },
          totalDays: {
            type: 'integer',
            minimum: 1,
            example: 45
          },
          studyFrequency: {
            type: 'string',
            enum: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'],
            example: 'DAILY'
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            example: '2024-02-01T00:00:00Z'
          },
          group: {
            type: 'string',
            example: 'Physics'
          },
          level: {
            type: 'string',
            example: '300'
          },
          materialType: {
            type: 'string',
            example: 'PQ'
          }
        }
      },
      StudyPlanResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'plan123'
              },
              title: {
                type: 'string',
                example: 'Calculus Final Exam Prep'
              },
              materialId: {
                type: 'string',
                example: 'material123'
              },
              userId: {
                type: 'string',
                example: 'user123'
              },
              totalDays: {
                type: 'integer',
                example: 30
              },
              studyFrequency: {
                type: 'string',
                enum: ['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'],
                example: 'DAILY'
              },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'],
                example: 'ACTIVE'
              },
              startDate: {
                type: 'string',
                format: 'date-time',
                example: '2024-02-01T00:00:00Z'
              },
              endDate: {
                type: 'string',
                format: 'date-time',
                example: '2024-03-02T00:00:00Z'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-20T10:30:00Z'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-20T10:30:00Z'
              }
            }
          }
        }
      },
      StudyPlansListResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'plan123'
                },
                title: {
                  type: 'string',
                  example: 'Calculus Final Exam Prep'
                },
                status: {
                  type: 'string',
                  enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'],
                  example: 'ACTIVE'
                },
                totalDays: {
                  type: 'integer',
                  example: 30
                },
                studyFrequency: {
                  type: 'string',
                  example: 'DAILY'
                },
                startDate: {
                  type: 'string',
                  format: 'date-time'
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            }
          }
        }
      },
      UpdateStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'],
            example: 'COMPLETED'
          }
        }
      },
      MarkFragmentCompleteRequest: {
        type: 'object',
        properties: {
          timeSpent: {
            type: 'integer',
            description: 'Time spent in minutes',
            example: 45
          },
          notes: {
            type: 'string',
            example: 'Completed chapter 3, need to review derivatives'
          }
        }
      },
      FragmentProgressResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              fragmentId: {
                type: 'string',
                example: 'fragment123'
              },
              completed: {
                type: 'boolean',
                example: true
              },
              timeSpent: {
                type: 'integer',
                example: 45
              },
              notes: {
                type: 'string',
                example: 'Completed chapter 3'
              },
              completedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-02-05T14:30:00Z'
              }
            }
          }
        }
      },
      StudyProgressResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              studyPlanId: {
                type: 'string',
                example: 'plan123'
              },
              totalFragments: {
                type: 'integer',
                example: 30
              },
              completedFragments: {
                type: 'integer',
                example: 15
              },
              progressPercentage: {
                type: 'number',
                format: 'float',
                example: 50.0
              },
              totalTimeSpent: {
                type: 'integer',
                description: 'Total time in minutes',
                example: 675
              },
              averageTimePerFragment: {
                type: 'number',
                format: 'float',
                example: 45.0
              },
              fragments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    title: {
                      type: 'string'
                    },
                    completed: {
                      type: 'boolean'
                    },
                    scheduledDate: {
                      type: 'string',
                      format: 'date-time'
                    },
                    completedAt: {
                      type: 'string',
                      format: 'date-time'
                    }
                  }
                }
              }
            }
          }
        }
      },
      DeleteResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Study plan deleted successfully'
              }
            }
          }
        }
      },
      // Material schemas
      UploadFileRequest: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File upload (PDF, DOC, DOCX, TXT, or images). Max size: 10MB'
          },
          title: {
            type: 'string',
            example: 'Introduction to Physics'
          },
          group: {
            type: 'string',
            example: 'Physics'
          },
          level: {
            type: 'string',
            example: '300'
          },
          materialType: {
            type: 'string',
            example: 'PQ'
          }
        }
      },
      CreateTextNoteRequest: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: {
            type: 'string',
            example: 'Quantum Mechanics Notes'
          },
          content: {
            type: 'string',
            example: 'Detailed notes on quantum mechanics principles...'
          },
          group: {
            type: 'string',
            example: 'Physics'
          },
          level: {
            type: 'string',
            example: '400'
          },
          materialType: {
            type: 'string',
            example: 'NOTES'
          }
        }
      },
      MaterialResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'material123'
              },
              userId: {
                type: 'string',
                example: 'user123'
              },
              title: {
                type: 'string',
                example: 'Introduction to Physics'
              },
              content: {
                type: 'string',
                example: 'Material content...'
              },
              fileUrl: {
                type: 'string',
                example: 'https://storage.example.com/files/physics.pdf'
              },
              fileType: {
                type: 'string',
                example: 'application/pdf'
              },
              group: {
                type: 'string',
                example: 'Physics'
              },
              level: {
                type: 'string',
                example: '300'
              },
              materialType: {
                type: 'string',
                example: 'PQ'
              },
              archived: {
                type: 'boolean',
                example: false
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z'
              }
            }
          }
        }
      },
      MaterialsListResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'material123'
                },
                title: {
                  type: 'string',
                  example: 'Introduction to Physics'
                },
                group: {
                  type: 'string',
                  example: 'Physics'
                },
                level: {
                  type: 'string',
                  example: '300'
                },
                materialType: {
                  type: 'string',
                  example: 'PQ'
                },
                archived: {
                  type: 'boolean',
                  example: false
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            }
          }
        }
      },
      UpdateMaterialRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'Updated Material Title'
          },
          content: {
            type: 'string',
            example: 'Updated content...'
          },
          group: {
            type: 'string',
            example: 'Physics'
          },
          archived: {
            type: 'boolean',
            example: false
          }
        }
      },
      MaterialStatsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalMaterials: {
                type: 'integer',
                example: 45
              },
              archivedMaterials: {
                type: 'integer',
                example: 5
              },
              bygroup: {
                type: 'object',
                additionalProperties: {
                  type: 'integer'
                },
                example: {
                  'Physics': 10,
                  'Mathematics': 15,
                  'Chemistry': 20
                }
              },
              byType: {
                type: 'object',
                additionalProperties: {
                  type: 'integer'
                },
                example: {
                  'PQ': 20,
                  'NOTES': 15,
                  'SLIDES': 10
                }
              }
            }
          }
        }
      },
      FilterByFieldRequest: {
        type: 'object',
        required: ['groupName'],
        properties: {
          groupName: {
            type: 'string',
            example: 'Physics'
          }
        }
      },
      FilterByLevelRequest: {
        type: 'object',
        required: ['levelName'],
        properties: {
          levelName: {
            type: 'string',
            example: '300'
          }
        }
      },
      FilterByMaterialTypeRequest: {
        type: 'object',
        required: ['materialType'],
        properties: {
          materialType: {
            type: 'string',
            example: 'PQ'
          }
        }
      },
      FilterBySchoolRequest: {
        type: 'object',
        required: ['schoolName'],
        properties: {
          schoolName: {
            type: 'string',
            example: 'University of Technology'
          }
        }
      },
      // PQ Hub schemas
      AskQuestionRequest: {
        type: 'object',
        required: ['question'],
        properties: {
          question: {
            type: 'string',
            example: 'What is the definition of quantum entanglement?'
          },
          materialIds: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['material123', 'material456'],
            description: 'Optional array of material IDs to search in'
          }
        }
      },
      QuestionAnswerResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'question123'
              },
              question: {
                type: 'string',
                example: 'What is the definition of quantum entanglement?'
              },
              answer: {
                type: 'string',
                example: 'Quantum entanglement is a physical phenomenon that occurs when...'
              },
              sources: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    materialId: {
                      type: 'string'
                    },
                    title: {
                      type: 'string'
                    },
                    relevance: {
                      type: 'number'
                    }
                  }
                }
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-02-09T10:30:00Z'
              }
            }
          }
        }
      },
      QuestionHistoryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: 'question123'
                },
                question: {
                  type: 'string',
                  example: 'What is quantum entanglement?'
                },
                answer: {
                  type: 'string',
                  example: 'Quantum entanglement is...'
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            }
          }
        }
      },
      PQHubStatsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalQuestions: {
                type: 'integer',
                example: 150
              },
              questionsThisWeek: {
                type: 'integer',
                example: 25
              },
              questionsThisMonth: {
                type: 'integer',
                example: 80
              },
              averageAnswerLength: {
                type: 'number',
                format: 'float',
                example: 250.5
              },
              mostUsedMaterials: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    materialId: {
                      type: 'string'
                    },
                    title: {
                      type: 'string'
                    },
                    count: {
                      type: 'integer'
                    }
                  }
                }
              }
            }
          }
        }
      },
      // Notification schemas
      NotificationResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'notif123'
          },
          userId: {
            type: 'string',
            example: 'user123'
          },
          title: {
            type: 'string',
            example: 'Study Plan Completed'
          },
          message: {
            type: 'string',
            example: 'Congratulations! You have completed your Calculus study plan.'
          },
          type: {
            type: 'string',
            enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
            example: 'SUCCESS'
          },
          read: {
            type: 'boolean',
            example: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-02-09T10:30:00Z'
          }
        }
      },
      NotificationsListResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/NotificationResponse'
            }
          }
        }
      },
      // Payment schemas
      CreatePaymentRequest: {
        type: 'object',
        required: ['amount', 'plan'],
        properties: {
          amount: {
            type: 'number',
            format: 'float',
            example: 29.99,
            description: 'Payment amount'
          },
          plan: {
            type: 'string',
            enum: ['BASIC', 'PREMIUM', 'PRO'],
            example: 'PREMIUM',
            description: 'Subscription plan type'
          }
        }
      },
      PaymentResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'payment123'
              },
              userId: {
                type: 'string',
                example: 'user123'
              },
              amount: {
                type: 'number',
                format: 'float',
                example: 29.99
              },
              plan: {
                type: 'string',
                example: 'PREMIUM'
              },
              status: {
                type: 'string',
                enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'],
                example: 'PENDING'
              },
              paymentMethod: {
                type: 'string',
                example: 'CARD'
              },
              transactionId: {
                type: 'string',
                example: 'txn_abc123xyz'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-02-09T10:30:00Z'
              }
            }
          }
        }
      },
      // Subscription schemas
      SubscriptionResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'sub123'
              },
              userId: {
                type: 'string',
                example: 'user123'
              },
              plan: {
                type: 'string',
                enum: ['FREE', 'BASIC', 'PREMIUM', 'PRO'],
                example: 'PREMIUM'
              },
              status: {
                type: 'string',
                enum: ['ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED'],
                example: 'ACTIVE'
              },
              startDate: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              },
              endDate: {
                type: 'string',
                format: 'date-time',
                example: '2024-12-31T23:59:59Z'
              },
              autoRenew: {
                type: 'boolean',
                example: true
              },
              features: {
                type: 'object',
                properties: {
                  maxStudyPlans: {
                    type: 'integer',
                    example: 10
                  },
                  maxMaterials: {
                    type: 'integer',
                    example: 50
                  },
                  pqHubAccess: {
                    type: 'boolean',
                    example: true
                  },
                  aiAssistance: {
                    type: 'boolean',
                    example: true
                  }
                }
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-02-09T10:30:00Z'
              }
            }
          }
        }
      },
      // Analytics schemas
      UsersByPlanResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              FREE: {
                type: 'integer',
                example: 150
              },
              BASIC: {
                type: 'integer',
                example: 75
              },
              PREMIUM: {
                type: 'integer',
                example: 45
              },
              PRO: {
                type: 'integer',
                example: 20
              },
              total: {
                type: 'integer',
                example: 290
              }
            }
          }
        }
      },
      MaterialsSummaryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalMaterials: {
                type: 'integer',
                example: 1250
              },
              bygroup: {
                type: 'object',
                additionalProperties: {
                  type: 'integer'
                },
                example: {
                  'Computer Science': 350,
                  'Mathematics': 280,
                  'Physics': 220,
                  'Chemistry': 200,
                  'Biology': 200
                }
              },
              byType: {
                type: 'object',
                additionalProperties: {
                  type: 'integer'
                },
                example: {
                  'PQ': 450,
                  'NOTES': 380,
                  'SLIDES': 250,
                  'ASSIGNMENT': 170
                }
              },
              byLevel: {
                type: 'object',
                additionalProperties: {
                  type: 'integer'
                },
                example: {
                  '100': 280,
                  '200': 320,
                  '300': 350,
                  '400': 300
                }
              },
              recentUploads: {
                type: 'integer',
                description: 'Materials uploaded in last 7 days',
                example: 45
              }
            }
          }
        }
      },
      StudyPlansSummaryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalPlans: {
                type: 'integer',
                example: 580
              },
              byStatus: {
                type: 'object',
                properties: {
                  ACTIVE: {
                    type: 'integer',
                    example: 320
                  },
                  COMPLETED: {
                    type: 'integer',
                    example: 180
                  },
                  PAUSED: {
                    type: 'integer',
                    example: 50
                  },
                  CANCELLED: {
                    type: 'integer',
                    example: 30
                  }
                }
              },
              byFrequency: {
                type: 'object',
                properties: {
                  DAILY: {
                    type: 'integer',
                    example: 350
                  },
                  WEEKLY: {
                    type: 'integer',
                    example: 150
                  },
                  BIWEEKLY: {
                    type: 'integer',
                    example: 50
                  },
                  MONTHLY: {
                    type: 'integer',
                    example: 30
                  }
                }
              },
              averageCompletionRate: {
                type: 'number',
                format: 'float',
                description: 'Percentage',
                example: 67.5
              },
              recentPlans: {
                type: 'integer',
                description: 'Plans created in last 7 days',
                example: 35
              }
            }
          }
        }
      },
      PaymentsSummaryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalPayments: {
                type: 'integer',
                example: 420
              },
              totalRevenue: {
                type: 'number',
                format: 'float',
                example: 12540.50
              },
              byStatus: {
                type: 'object',
                properties: {
                  CONFIRMED: {
                    type: 'integer',
                    example: 380
                  },
                  PENDING: {
                    type: 'integer',
                    example: 25
                  },
                  FAILED: {
                    type: 'integer',
                    example: 10
                  },
                  CANCELLED: {
                    type: 'integer',
                    example: 5
                  }
                }
              },
              byPlan: {
                type: 'object',
                properties: {
                  BASIC: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'integer',
                        example: 180
                      },
                      revenue: {
                        type: 'number',
                        format: 'float',
                        example: 3590.20
                      }
                    }
                  },
                  PREMIUM: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'integer',
                        example: 150
                      },
                      revenue: {
                        type: 'number',
                        format: 'float',
                        example: 5985.00
                      }
                    }
                  },
                  PRO: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'integer',
                        example: 90
                      },
                      revenue: {
                        type: 'number',
                        format: 'float',
                        example: 5385.30
                      }
                    }
                  }
                }
              },
              thisMonth: {
                type: 'object',
                properties: {
                  count: {
                    type: 'integer',
                    example: 45
                  },
                  revenue: {
                    type: 'number',
                    format: 'float',
                    example: 1340.75
                  }
                }
              },
              lastMonth: {
                type: 'object',
                properties: {
                  count: {
                    type: 'integer',
                    example: 52
                  },
                  revenue: {
                    type: 'number',
                    format: 'float',
                    example: 1580.50
                  }
                }
              }
            }
          }
        }
      },
      QAHistorySummaryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            properties: {
              totalQuestions: {
                type: 'integer',
                example: 3420
              },
              questionsToday: {
                type: 'integer',
                example: 87
              },
              questionsThisWeek: {
                type: 'integer',
                example: 542
              },
              questionsThisMonth: {
                type: 'integer',
                example: 1850
              },
              averageQuestionsPerUser: {
                type: 'number',
                format: 'float',
                example: 11.8
              },
              mostActiveUsers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userId: {
                      type: 'string',
                      example: 'user123'
                    },
                    userName: {
                      type: 'string',
                      example: 'John Doe'
                    },
                    questionCount: {
                      type: 'integer',
                      example: 145
                    }
                  }
                },
                description: 'Top 5 users by question count'
              },
              popularTopics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    topic: {
                      type: 'string',
                      example: 'Quantum Mechanics'
                    },
                    count: {
                      type: 'integer',
                      example: 234
                    }
                  }
                },
                description: 'Top topics by question count'
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new student account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Missing required fields or user already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Missing email or password',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get user profile',
        description: 'Retrieve authenticated user profile information',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserProfile'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Invalid or missing token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Authentication'],
        summary: 'Edit user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  school: { type: 'string' }
                }
              }
           }
          }
        },
        responses: {
          '200': {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/forgot-password': {
      get: {
        tags: ['Authentication'],
        summary: 'Send password reset email',
        description: 'Send password reset email to update user password',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reset email sent',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserProfile'
                }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset user password',
        description: 'Reset user password using unique tokeb',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserProfile'
                }
              }
            }
          },
          '400': {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan': {
      post: {
        tags: ['Study Plans'],
        summary: 'Create a study plan',
        description: 'Create a new study plan with existing material',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateStudyPlanRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Study plan created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlanResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Missing required fields',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Study Plans'],
        summary: 'Get user study plans',
        description: 'Retrieve all study plans for authenticated user',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filter by study plan status',
            required: false,
            schema: {
              type: 'string',
              enum: ['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED']
            }
          }
        ],
        responses: {
          '200': {
            description: 'Study plans retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlansListResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan/upload': {
      post: {
        tags: ['Study Plans'],
        summary: 'Create study plan with file upload',
        description: 'Create a new study plan by uploading a study material file (PDF, DOC, DOCX, TXT, or images)',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/CreateStudyPlanWithFileRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Study plan created successfully with uploaded file',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlanResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Missing required fields or invalid file',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan/{id}': {
      get: {
        tags: ['Study Plans'],
        summary: 'Get study plan by ID',
        description: 'Retrieve a specific study plan',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Study plan ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Study plan retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlanResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Study plan ID is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Study plan not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Study Plans'],
        summary: 'Delete study plan',
        description: 'Delete a specific study plan',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Study plan ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Study plan deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DeleteResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan/{id}/status': {
      patch: {
        tags: ['Study Plans'],
        summary: 'Update study plan status',
        description: 'Update the status of a study plan (ACTIVE, COMPLETED, PAUSED, CANCELLED)',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Study plan ID',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateStatusRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Study plan status updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlanResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Status is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan/{id}/progress': {
      get: {
        tags: ['Study Plans'],
        summary: 'Get study progress',
        description: 'Retrieve detailed progress information for a study plan',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Study plan ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Progress retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyProgressResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Study plan not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/studyplan/fragment/{fragmentId}/complete': {
      post: {
        tags: ['Study Plans'],
        summary: 'Mark fragment as complete',
        description: 'Mark a study plan fragment as completed with optional time spent and notes',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'fragmentId',
            in: 'path',
            required: true,
            description: 'Fragment ID',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MarkFragmentCompleteRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Fragment marked as complete successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FragmentProgressResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Fragment ID is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/upload': {
      post: {
        tags: ['Materials'],
        summary: 'Upload study material file',
        description: 'Upload a file (PDF, DOC, DOCX, TXT, or images) as study material',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/UploadFileRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'File uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - No file uploaded or invalid file type',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/user': {
      get: {
        tags: ['Materials'],
        summary: 'Get user materials',
        description: 'Retrieve all materials for authenticated user with optional filters',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'materialType',
            in: 'query',
            description: 'Filter by materialTypes',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'group',
            in: 'query',
            description: 'Filter by group',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Materials retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialsListResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/stats': {
      get: {
        tags: ['Materials'],
        summary: 'Get material statistics',
        description: 'Retrieve statistics about user materials',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Stats retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialStatsResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/search': {
      get: {
        tags: ['Materials'],
        summary: 'Search materials',
        description: 'Search user materials by query string',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'page',
            in: 'query',
            required: true,
            description: 'Pagination',
            schema: {
              type: 'string'
            }
          },
          {
            name: 'limit',
            in: 'query',
            required: true,
            description: 'Pagination',
            schema: {
              type: 'string'
            }
          },
        ],
        responses: {
          '200': {
            description: 'Search results retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialsListResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Search query is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/all': {
      get: {
        tags: ['Materials'],
        summary: 'Get all materials',
        description: 'Retrieve all materials from the system',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'All materials retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialsListResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/{id}': {
      get: {
        tags: ['Materials'],
        summary: 'Get material by ID',
        description: 'Retrieve a specific material',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Material ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Material retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Material ID is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Material not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Materials'],
        summary: 'Update material',
        description: 'Update material information',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Material ID',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateMaterialRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Material updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Materials'],
        summary: 'Delete material',
        description: 'Delete a specific material',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Material ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Material deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DeleteResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/{id}/archive': {
      patch: {
        tags: ['Materials'],
        summary: 'Archive material',
        description: 'Archive a specific material',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Material ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Material archived successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/material/{id}/unarchive': {
      patch: {
        tags: ['Materials'],
        summary: 'Unarchive material',
        description: 'Unarchive a specific material',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Material ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Material unarchived successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    "/material/schools": {
      get: {
        tags: ["Materials"],
        summary: "Get all schools with materials",
        description: "Returns a list of distinct schools that have materials uploaded",
        responses: {
          200: {
            description: "Schools fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { type: "string", example: "Federal University, Lafia" }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Server error"
          }
        }
      }
    },
    "/material/groups": {
      get: {
        tags: ["Materials"],
        summary: "Get groups in a school",
        description: "Returns distinct groups for a selected school",
        parameters: [
          {
            name: "school",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Federal University, Lafia"
          }
        ],
        responses: {
          200: {
            description: "Groups fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { type: "string", example: "Computer Science" }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Missing school parameter"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },
    "/material/levels": {
      get: {
        tags: ["Materials"],
        summary: "Get levels in a group",
        description: "Returns distinct academic levels for a school and group",
        parameters: [
          {
            name: "school",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Federal University, Lafia"
          },
          {
            name: "group",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Computer Science"
          }
        ],
        responses: {
          200: {
            description: "Levels fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { type: "string", example: "300" }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Missing school or group parameter"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },
    "/material/materialTypes": {
      get: {
        tags: ["Materials"],
        summary: "Get material types for a level",
        description: "Returns distinct material types for a specific school, group, and level",
        parameters: [
          {
            name: "school",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Federal University, Lafia"
          },
          {
            name: "group",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "Computer Science"
          },
          {
            name: "level",
            in: "query",
            required: true,
            schema: { type: "string" },
            example: "300"
          }
        ],
        responses: {
          200: {
            description: "Material types fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { type: "string", example: "Lecture Note" }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Missing required query parameters"
          },
          500: {
            description: "Server error"
          }
        }
      }
    },
    '/pqhub/ask': {
      post: {
        tags: ['PQ Hub'],
        summary: 'Ask a question',
        description: 'Ask a question and get AI-powered answers based on uploaded materials',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AskQuestionRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Question answered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QuestionAnswerResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Question is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/pqhub/history': {
      get: {
        tags: ['PQ Hub'],
        summary: 'Get question history',
        description: 'Retrieve question/answer history with pagination',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of results to return (default: 50)',
            required: false,
            schema: {
              type: 'integer',
              default: 50
            }
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of results to skip (default: 0)',
            required: false,
            schema: {
              type: 'integer',
              default: 0
            }
          }
        ],
        responses: {
          '200': {
            description: 'History retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QuestionHistoryResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/pqhub/stats': {
      get: {
        tags: ['PQ Hub'],
        summary: 'Get PQ Hub statistics',
        description: 'Retrieve usage statistics for PQ Hub',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Stats retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PQHubStatsResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/pqhub/search': {
      get: {
        tags: ['PQ Hub'],
        summary: 'Search question history',
        description: 'Search through question/answer history',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Search results retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QuestionHistoryResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Search query is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/pqhub/{id}': {
      get: {
        tags: ['PQ Hub'],
        summary: 'Get question by ID',
        description: 'Retrieve a specific question and answer',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Question ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Question retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QuestionAnswerResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Question ID is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '404': {
            description: 'Question not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['PQ Hub'],
        summary: 'Delete question',
        description: 'Delete a specific question from history',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Question ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Question deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DeleteResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/pqhub/history/clear': {
      delete: {
        tags: ['PQ Hub'],
        summary: 'Clear all history',
        description: 'Delete all questions from history',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'History cleared successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DeleteResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/notification': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        description: 'Retrieve all notifications for authenticated user',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Notifications retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NotificationsListResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/notification/{id}/read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        description: 'Mark a specific notification as read',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Notification ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Notification marked as read successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Notification ID is required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/payment': {
      post: {
        tags: ['Payments'],
        summary: 'Create payment',
        description: 'Create a new payment for subscription',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreatePaymentRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Payment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Payment failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/payment/{paymentId}/confirm': {
      patch: {
        tags: ['Payments'],
        summary: 'Confirm payment',
        description: 'Confirm a payment (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'paymentId',
            in: 'path',
            required: true,
            description: 'Payment ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Payment confirmed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - Payment ID is required or confirmation failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/subscription/me': {
      get: {
        tags: ['Subscriptions'],
        summary: 'Get my subscription',
        description: 'Retrieve current user subscription information',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Subscription retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SubscriptionResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/analytics/users-by-plan': {
      get: {
        tags: ['Analytics'],
        summary: 'Get users by subscription plan',
        description: 'Get count of users grouped by subscription plan (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Users by plan retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsersByPlanResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/analytics/materials-summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Get materials summary',
        description: 'Get comprehensive summary of all materials in the system (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Materials summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MaterialsSummaryResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/analytics/study-plans-summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Get study plans summary',
        description: 'Get comprehensive summary of all study plans in the system (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Study plans summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StudyPlansSummaryResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/analytics/payments-summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Get payments summary',
        description: 'Get comprehensive summary of all payments and revenue (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Payments summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentsSummaryResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/analytics/qa-history-summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Get Q&A history summary',
        description: 'Get comprehensive summary of all PQ Hub questions and activity (Admin only)',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Q&A history summary retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/QAHistorySummaryResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Admin access required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  }
};

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));
  console.log('Docs available at http://localhost:4000/docs');
};